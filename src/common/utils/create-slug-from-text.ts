import { slugify } from './slugify';

export function createSlugFromText(text: string): string {
  return slugify(text) + `-${Math.random().toString(36).substring(2)}`;
}
