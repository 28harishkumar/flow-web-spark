import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUUID(id: string | null): boolean {
  if (id === null) return true;

  const uuidRegex =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function createSlug(str: string): string {
  return str.toLowerCase().replace(" ", "_");
}
