import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function capitalizeWords(str) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w+\b/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\bS\b/g, "'s");
}