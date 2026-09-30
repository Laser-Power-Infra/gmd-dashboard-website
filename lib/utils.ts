import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, letting later Tailwind utilities win over earlier ones.
 *
 * Required by the shadcn primitives in `components/ui/`. The rest of the site
 * predates Tailwind and does not import this.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
