const MAX_SLUG_LENGTH = 150;

export function slugify(name: string): string {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, "");
}

export function uniqueSlug(base: string, used: Iterable<string>): string {
  if (!base) return "";
  const occupied = new Set(used);
  let candidate = base;
  let increment = 2;
  while (occupied.has(candidate)) {
    const suffix = `-${increment++}`;
    candidate = `${base.slice(0, MAX_SLUG_LENGTH - suffix.length).replace(/-+$/g, "")}${suffix}`;
  }
  return candidate;
}
