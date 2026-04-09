/**
 * Media and document URLs from the CMS: full URLs, protocol-relative, or same-origin paths
 * (e.g. Easypanel volume mounted at /app/build/images → use /images/photo.jpg).
 */

export function isUsableMediaUrl(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return false;
  if (s.startsWith('http://') || s.startsWith('https://')) return s.length > 10;
  if (s.startsWith('//')) return s.length > 4;
  if (s.startsWith('/') && !s.startsWith('//')) return s.length >= 2;
  return false;
}

/** Prefix with CRA PUBLIC_URL when the app is hosted under a subpath. */
export function resolvePublicAssetUrl(url) {
  const s = String(url ?? '').trim();
  if (!s) return '';
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return s;
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  if (s.startsWith('/')) return `${base}${s}`;
  return s;
}
