import sanitizeHtml from "sanitize-html";

export function prepareBlogContent(contentHtml: string) {
  const toc: { id: string; titleHtml: string }[] = [];
  // Editor content can contain non-breaking spaces between every word.
  // Restore normal wrapping before sanitizing the HTML.
  const normalizedHtml = contentHtml.replace(/&nbsp;|&#0*160;|&#x0*a0;|\u00a0/gi, " ");
  const safeHtml = sanitizeHtml(normalizedHtml, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      a: ["href", "title", "rel"],
      img: ["src", "alt", "width", "height"],
      ol: ["start"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
  const html = safeHtml.replace(/<(h[23])>([\s\S]*?)<\/\1>/gi, (_, tag: string, inner: string) => {
    const id = `bagian-${toc.length + 1}`;
    toc.push({ id, titleHtml: sanitizeHtml(inner, { allowedTags: [], allowedAttributes: {} }) });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { html, toc };
}
