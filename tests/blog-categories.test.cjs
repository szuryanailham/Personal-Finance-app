const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(relativePath, imports, globals = {}) {
  const context = { exports: {}, require: (name) => {
    assert.ok(name in imports, `Unexpected import ${name}`);
    return imports[name];
  }, URLSearchParams, ...globals };
  const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, context);
  return context.exports;
}

function setup() {
  const requests = [];
  let response = { status: 200, data: [], paging: { currentPage: 0, size: 20, totalPage: 1, totalItem: 0 } };
  let redirected = false;
  const client = load("src/lib/api/client.ts", { "@/lib/auth": {
    getSessionToken: () => "finance-session", redirectToLogin: () => { redirected = true; },
  } }, {
    process: { env: {} },
    fetch: async (url, options) => {
      requests.push({ url, ...options });
      return { status: response.status, ok: response.status < 400, headers: new Headers(), json: async () => response };
    },
  });
  const api = load("src/lib/api/admin/blog-categories.ts", { "@/lib/api/client": client });
  const tags = load("src/lib/api/admin/blog-tags.ts", { "@/lib/api/client": client });
  const posts = load("src/lib/api/admin/blog-posts.ts", { "@/lib/api/client": client });
  return { api, tags, posts, client, requests, respond: (next) => { response = next; }, redirected: () => redirected };
}

const category = { id: "category-id", name: "Tips Keuangan", slug: "tips-keuangan", description: "Tips" };

test("category list uses blog bearer token and zero-based server pagination/search", async () => {
  const { api, requests } = setup();
  await api.fetchBlogCategories("blog-session", 2, "tips & tabungan");
  const query = new URL(requests[0].url, "http://localhost");
  assert.equal(query.pathname, "/api/blog/categories");
  assert.equal(query.searchParams.get("page"), "2");
  assert.equal(query.searchParams.get("size"), "20");
  assert.equal(query.searchParams.get("search"), "tips & tabungan");
  assert.equal(requests[0].headers.Authorization, "Bearer blog-session");
});

test("create, update and delete match category API contract", async () => {
  const { api, requests, respond } = setup();
  respond({ status: 201, data: category });
  await api.saveBlogCategory("blog-session", category);
  assert.equal(requests[0].method, "POST");
  assert.equal(requests[0].url, "/api/blog/categories");
  assert.deepEqual(JSON.parse(requests[0].body), category);
  respond({ status: 200, data: category });
  await api.saveBlogCategory("blog-session", category, category.id);
  assert.equal(requests[1].method, "PUT");
  assert.equal(requests[1].url, "/api/blog/categories/category-id");
  respond({ status: 200, data: null });
  await api.deleteBlogCategory("blog-session", category.id);
  assert.equal(requests[2].method, "DELETE");
  assert.equal(requests[2].url, "/api/blog/categories/category-id");
});

test("blog 401 does not redirect or invalidate the finance session", async () => {
  const { api, respond, redirected, client } = setup();
  respond({ status: 401, errors: "Invalid credentials or session" });
  await assert.rejects(api.fetchBlogCategories("expired-blog-session", 0, ""), (error) => error instanceof client.ApiError && error.status === 401);
  assert.equal(redirected(), false);
});

test("finance API keeps its existing bearer and 401 redirect behavior", async () => {
  const { client, requests, respond, redirected } = setup();
  respond({ status: 401, errors: "Expired" });
  await assert.rejects(client.apiRequest("/api/users/me", "profil"));
  assert.equal(requests[0].headers.Authorization, "Bearer finance-session");
  assert.equal(redirected(), true);
});

test("category conflicts and permission errors reach the UI", async () => {
  const { api, respond } = setup();
  for (const status of [403, 409]) {
    respond({ status, errors: status === 409 ? "Category or tag is still used by a post" : "ADMIN or EDITOR role is required" });
    await assert.rejects(api.deleteBlogCategory("blog-session", "id"), (error) => error.status === status);
  }
});

test("blog login uses public endpoint and rejects expired sessions", async () => {
  const { api, requests, respond } = setup();
  const session = { token: "blog-session", expiresAt: new Date(Date.now() + 60000).toISOString(), user: { roles: ["ADMIN"] } };
  respond({ status: 200, data: session });
  assert.equal(await api.loginBlog("blog@example.com", "password"), session);
  assert.equal(requests[0].url, "/api/blog/auth/login");
  assert.equal(requests[0].headers.Authorization, undefined);
  respond({ status: 200, data: { ...session, expiresAt: "invalid" } });
  await assert.rejects(api.loginBlog("blog@example.com", "password"));
});

test("automatic slug normalizes spaces, punctuation, accents and empty names", () => {
  const { slugify } = load("src/lib/blog-slug.ts", {});
  assert.equal(slugify("  Tips   Keuangan & Café!  "), "tips-keuangan-cafe");
  assert.equal(slugify("Dana---Darurat"), "dana-darurat");
  assert.equal(slugify("   !!! "), "");
});

test("duplicate slug increments and keeps suffix within the length limit", () => {
  const { uniqueSlug } = load("src/lib/blog-slug.ts", {});
  assert.equal(uniqueSlug("tips", ["tips", "tips-2", "tips-3"]), "tips-4");
  assert.equal(uniqueSlug("tips", ["tips-2"]), "tips");
  const base = "a".repeat(150);
  const second = uniqueSlug(base, [base]);
  assert.equal(second.length, 150);
  assert.ok(second.endsWith("-2"));
  assert.equal(uniqueSlug(base, [base, second]), "a".repeat(148) + "-3");
});

test("slug availability checks all matching pages and excludes the edited category", async () => {
  const requestedPages = [];
  const api = load("src/lib/api/admin/blog-categories.ts", { "@/lib/api/client": {
    apiRequest: async (_path, _label, options) => {
      const page = Number(options.params.get("page"));
      requestedPages.push(page);
      return {
        data: page === 0 ? [{ id: "editing", slug: "tips" }] : [{ id: "other", slug: "tips-2" }],
        paging: { totalPage: 2 },
      };
    },
  } });
  const slugs = await api.fetchBlogCategorySlugs("blog-session", "tips", "editing");
  assert.deepEqual(requestedPages, [0, 1]);
  assert.equal(JSON.stringify(slugs), JSON.stringify(["tips-2"]));
});


test("tags use blog token, server search/pagination and only name/slug for writes", async () => {
  const { tags, requests, respond } = setup();
  await tags.fetchBlogTags("blog-session", 1, "tips & tabungan");
  const url = new URL(requests[0].url, "http://localhost");
  assert.equal(url.pathname, "/api/blog/tags");
  assert.equal(url.searchParams.get("page"), "1");
  assert.equal(url.searchParams.get("size"), "20");
  assert.equal(url.searchParams.get("search"), "tips & tabungan");
  assert.equal(requests[0].headers.Authorization, "Bearer blog-session");
  respond({ status: 201, data: category });
  await tags.saveBlogTag("blog-session", category);
  assert.equal(requests[1].method, "POST");
  assert.equal(requests[1].url, "/api/blog/tags");
  assert.deepEqual(JSON.parse(requests[1].body), { name: category.name, slug: category.slug });
  await tags.saveBlogTag("blog-session", category, "tag/id");
  assert.equal(requests[2].method, "PUT");
  assert.equal(requests[2].url, "/api/blog/tags/tag%2Fid");
  respond({ status: 200, data: null });
  await tags.deleteBlogTag("blog-session", "tag-id");
  assert.equal(requests[3].method, "DELETE");
  assert.equal(requests[3].url, "/api/blog/tags/tag-id");
});

test("tag auth, permission and in-use errors preserve the finance session", async () => {
  const { tags, respond, redirected } = setup();
  for (const status of [401, 403, 409]) {
    respond({ status, errors: "Tag operation rejected" });
    await assert.rejects(tags.deleteBlogTag("blog-session", "id"), (error) => error.status === status && error.message === "Tag operation rejected");
  }
  assert.equal(redirected(), false);
});

test("tag slug lookup scans all pages and excludes edited tag", async () => {
  const requestedPages = [];
  const tags = load("src/lib/api/admin/blog-tags.ts", { "@/lib/api/client": {
    apiRequest: async (path, _label, options) => {
      assert.equal(path, "/api/blog/tags");
      const page = Number(options.params.get("page"));
      requestedPages.push(page);
      return { data: page === 0 ? [{ id: "editing", slug: "tips" }] : [{ id: "other", slug: "tips-2" }], paging: { totalPage: 2 } };
    },
  } });
  const slugs = await tags.fetchBlogTagSlugs("blog-session", "tips", "editing");
  assert.deepEqual(requestedPages, [0, 1]);
  assert.equal(JSON.stringify(slugs), JSON.stringify(["tips-2"]));
});


test("blog edit and delete use encoded slug and blog credentials", async () => {
  const { posts, requests, respond } = setup();
  const post = { title: "Judul", slug: "tips & tabungan", excerpt: "Ringkasan", contentHtml: "<p>Isi</p>", status: "DRAFT", categoryIds: ["category-id"], tagIds: [] };
  respond({ status: 200, data: post });
  await posts.fetchBlogPost("blog-session", post.slug);
  await posts.updateBlogPost("blog-session", post.slug, post);
  respond({ status: 204 });
  await posts.deleteBlogPost("blog-session", post.slug);
  assert.deepEqual(requests.map(request => request.method), ["GET", "PATCH", "DELETE"]);
  for (const request of requests) {
    assert.equal(request.url, "/api/blog/posts/tips%20%26%20tabungan");
    assert.equal(request.headers.Authorization, "Bearer blog-session");
  }
  assert.deepEqual(JSON.parse(requests[1].body), post);
});


test("blog edit resolves the existing hero URL from paginated admin summaries", async () => {
  const requests = [];
  const detail = { title: "Blog", slug: "blog", contentHtml: "<p>Isi</p>", categoryIds: [], tagIds: [], featuredMediaId: "media-id" };
  const posts = load("src/lib/api/admin/blog-posts.ts", { "@/lib/api/client": {
    apiRequest: async (url, action, options) => {
      requests.push({ url, ...options });
      if (url.endsWith("/blog")) return { data: detail };
      const skip = Number(options.params.get("skip"));
      return { data: skip === 0 ? [] : [{ slug: "blog", heroImage: "https://ik.imagekit.io/blog/hero.jpg" }],
        paging: { skip, limit: 20, totalItem: 21, hasMore: skip === 0 } };
    },
  } });
  const result = await posts.fetchBlogPost("blog-token", "blog");
  assert.equal(result.heroImage, "https://ik.imagekit.io/blog/hero.jpg");
  assert.equal(result.featuredMediaId, "media-id");
  assert.equal(requests[2].params.get("skip"), "20");
  assert.ok(requests.every(request => request.accessToken === "blog-token"));
});
