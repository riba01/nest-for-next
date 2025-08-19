import { generateRandomSuffix } from './generate-random-suffix';
import { slugify } from './slugify';

export function createSlugFromText(text: string): string {
  return slugify(text) + `-${generateRandomSuffix()}`;
}
