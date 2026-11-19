/**
 * Imagens locais (fotografias reais em /public/fotos/).
 * Cada foto tem um arquivo principal e, opcionalmente, um srcset pronto.
 */

export interface MediaItem {
  /** Caminho do arquivo em /public. */
  local: string;
  /** srcset pronto, ex.: '/fotos/a-960.webp 960w, /fotos/a-1600.webp 1600w'. */
  localSrcset?: string;
  alt: string;
  /** Proporção natural da foto (largura / altura). */
  ratio: number;
  /** Ponto focal para recortes (0–1). */
  focus?: { x: number; y: number };
}

export function mediaSrc(item: MediaItem, _width?: number, _ratio?: number): string {
  return item.local;
}

export function mediaSrcset(item: MediaItem, _ratio?: number, _widths?: number[]): string | undefined {
  return item.localSrcset;
}
