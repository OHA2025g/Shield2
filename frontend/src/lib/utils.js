import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Long single-token strings (e.g. accidental CMS junk) — hide from UI captions */
export function looksLikeGibberishText(s) {
  const t = (s || '').trim();
  if (t.length < 14) return false;
  if (/\s/.test(t)) return false;
  return /^[a-z0-9]+$/i.test(t);
}
