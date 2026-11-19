/**
 * Caminhos de arquivos em /public respeitando o `base` do Astro.
 * No GitHub Pages o site fica em /<repositório>/; num domínio próprio, em /.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** asset('/fotos/a.webp') → '/silbeyer-site/fotos/a.webp' (ou '/fotos/a.webp' na raiz). */
export const asset = (path: string): string => `${BASE}${path}`;

/** Página inicial. */
export const home = `${BASE}/`;
