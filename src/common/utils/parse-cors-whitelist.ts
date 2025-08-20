export function parseCorsWhitelists(raw: string): string[] {
  return raw
    .split(/\s+/g)
    .map(url => url.replace(/\/+$/, ''))
    .filter(Boolean);
}
