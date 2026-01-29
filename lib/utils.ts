import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getCurrentDate } from './helpers';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
}

export function formatToSlug(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, "") // 🧹 remove everything inside parentheses (including the parentheses)
    .replace(/[^\w\s-]/g, "") // remove all characters except letters, numbers, spaces, and '-'
    .replace(/\s+/g, "-") // replace spaces with '-'
    .replace(/--+/g, "-") // replace multiple '-' with a single one
    .replace(/^-+|-+$/g, ""); // remove '-' from the beginning and end

  return slug;
}

export function extractPathFromPublicUrl(url: string, bucket: string) {
  const marker = `/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

export const generateFilenameWithDatetime = (filename: string) => {
  const [name, ext] = filename.split(".");

  const formattedName = `${name}-${getCurrentDate()}`;

  return { formattedName, ext }
}