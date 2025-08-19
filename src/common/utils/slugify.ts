export function slugify(text: string): string {
  return text
    .normalize('NFKD') //separa acentos de letras
    .toLocaleLowerCase() // tudo minusculo
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}
