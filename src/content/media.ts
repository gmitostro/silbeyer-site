import type { MediaItem } from '../lib/images';
import { asset } from '../lib/paths';

/**
 * Registro central de imagens. Todas são fotografias reais da Silbeyer, em
 * /public/fotos/ (originais HEIC na pasta claude/, convertidos para WebP).
 *
 * Fotos deixadas de fora de propósito: IMG_5472 e IMG_5473 (mostram a marca de
 * um cliente) e IMG_5468 (quase igual à IMG_5467). IMG_3660 também mostra a
 * marca de um cliente — está só na seção Soluções; uso autorizado pela empresa.
 */
const g = (slug: string) => ({
  local: asset(`/fotos/galeria/${slug}-1600.webp`),
  localSrcset: `${asset(`/fotos/galeria/${slug}-960.webp`)} 960w, ${asset(`/fotos/galeria/${slug}-1600.webp`)} 1600w`,
});

export const media = {
  /** Hero. */
  hero: {
    // IMG_2980 — caixa de compensado fechada, pronta, no setor de montagem.
    local: asset('/fotos/hero-1600.webp'),
    localSrcset: `${asset('/fotos/hero-960.webp')} 960w, ${asset('/fotos/hero-1600.webp')} 1600w`,
    alt: 'Caixa de madeira compensada fechada, com pés de pallet, pronta no setor de montagem da Silbeyer',
    ratio: 1,
    focus: { x: 0.5, y: 0.5 },
  },
  /** Solução 01. */
  slattedCrates: {
    // IMG_5335 — engradados de grande porte empilhados, com marcações de manuseio.
    local: asset('/fotos/engradados-1600.webp'),
    localSrcset: `${asset('/fotos/engradados-960.webp')} 960w, ${asset('/fotos/engradados-1600.webp')} 1600w`,
    alt: 'Engradados de madeira de grande porte empilhados, com símbolos de manuseio estampados',
    ratio: 4 / 5,
    focus: { x: 0.5, y: 0.5 },
  },
  /** Solução 02. */
  closedCrates: {
    // IMG_3660 — caixas fechadas empilhadas no galpão. Atenção: aparece a marca de um cliente nas caixas.
    local: asset('/fotos/caixas-1600.webp'),
    localSrcset: `${asset('/fotos/caixas-960.webp')} 960w, ${asset('/fotos/caixas-1600.webp')} 1600w`,
    alt: 'Caixas de madeira fechadas, empilhadas em colunas dentro do galpão',
    ratio: 4 / 5,
    focus: { x: 0.5, y: 0.45 },
  },
  /** Solução 03 — embalagens para máquinas e equipamentos. */
  machineCrate: {
    ...g('caixa-pes'), // IMG_5469
    alt: 'Caixa de madeira compensada fechada, de grande porte, com pés para empilhadeira',
    ratio: 16 / 9,
    focus: { x: 0.5, y: 0.5 },
  },
  /** Seção Critérios — composição em camadas. */
  lumber: {
    ...g('quadros'), // IMG_5463
    alt: 'Quadros de madeira empilhados em coluna, prontos para a montagem das embalagens',
    ratio: 9 / 16,
    focus: { x: 0.5, y: 0.5 },
  },
  /** Seção Processo. */
  workshop: {
    ...g('paineis'), // IMG_5464
    alt: 'Painéis e quadros de madeira em produção, encostados na parede do galpão',
    ratio: 16 / 9,
    focus: { x: 0.5, y: 0.5 },
  },
  sawBlade: {
    ...g('serra-detalhe'), // IMG_5462
    alt: 'Lâmina da serra circular de bancada, com serragem sobre a mesa',
    ratio: 9 / 16,
    focus: { x: 0.5, y: 0.5 },
  },
  /** Seção Aplicações. */
  machinery: {
    ...g('caixa-longa'), // IMG_5470
    alt: 'Caixa de madeira longa, de grande porte, montada no galpão para equipamento',
    ratio: 16 / 9,
    focus: { x: 0.5, y: 0.55 },
  },
  forklift: {
    // IMG_5339 — pilha de pallets de madeira.
    local: asset('/fotos/armazenagem-1600.webp'),
    localSrcset: `${asset('/fotos/armazenagem-960.webp')} 960w, ${asset('/fotos/armazenagem-1600.webp')} 1600w`,
    alt: 'Pallets de madeira novos empilhados no galpão da Silbeyer',
    ratio: 4 / 3,
    focus: { x: 0.5, y: 0.5 },
  },
  truckLoading: {
    // IMG_4530 — caminhão carregado com engradados e pallets, cintado para a entrega.
    local: asset('/fotos/transporte-1600.webp'),
    localSrcset: `${asset('/fotos/transporte-960.webp')} 960w, ${asset('/fotos/transporte-1600.webp')} 1600w`,
    alt: 'Caminhão carregado com engradados e pallets de madeira, amarrados com cintas para o transporte',
    ratio: 4 / 3,
    focus: { x: 0.5, y: 0.55 },
  },
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;

/**
 * Galeria em carrossel: a ordem conta o caminho da madeira — do corte à expedição.
 * `stage` é a etapa mostrada na legenda; `focus` (0–1) é o ponto vertical do recorte.
 */
export interface GalleryItem {
  slug: string;
  stage: 'Corte' | 'Componentes' | 'Montagem' | 'Embalagem pronta' | 'Expedição';
  alt: string;
  focus: number;
}

export const gallery: GalleryItem[] = [
  { slug: 'serra-detalhe', stage: 'Corte', alt: 'Lâmina da serra circular de bancada, com serragem sobre a mesa', focus: 0.5 },
  { slug: 'serra-bancada', stage: 'Corte', alt: 'Serra de bancada com tábuas cortadas ao fundo', focus: 0.78 },
  { slug: 'quadros', stage: 'Componentes', alt: 'Quadros de madeira empilhados em coluna', focus: 0.5 },
  { slug: 'paineis', stage: 'Componentes', alt: 'Painéis e quadros de madeira em produção, encostados na parede do galpão', focus: 0.55 },
  { slug: 'pallets', stage: 'Componentes', alt: 'Pallets de madeira novos empilhados no galpão', focus: 0.5 },
  { slug: 'tampa', stage: 'Montagem', alt: 'Painel de compensado com quadro de reforço, pronto para fechar uma caixa', focus: 0.55 },
  { slug: 'caixas-simbolos', stage: 'Montagem', alt: 'Caixas de madeira com símbolos de manuseio estampados', focus: 0.45 },
  { slug: 'caixas-empilhadas', stage: 'Embalagem pronta', alt: 'Duas caixas de madeira empilhadas, com símbolos de manuseio', focus: 0.5 },
  { slug: 'caixas-frente', stage: 'Embalagem pronta', alt: 'Caixas de madeira empilhadas, vistas de frente, com alças e símbolos de manuseio', focus: 0.5 },
  { slug: 'caixa-pes', stage: 'Embalagem pronta', alt: 'Caixa de compensado fechada, de grande porte, com pés para empilhadeira', focus: 0.5 },
  { slug: 'caixa-longa', stage: 'Embalagem pronta', alt: 'Caixa de madeira longa, de grande porte, montada no galpão', focus: 0.55 },
  { slug: 'caixa-galpao', stage: 'Embalagem pronta', alt: 'Caixa de madeira longa vista em diagonal, no galpão de montagem', focus: 0.55 },
  { slug: 'caixa-pronta', stage: 'Embalagem pronta', alt: 'Caixa de compensado fechada, com pés de pallet, pronta no setor de montagem', focus: 0.55 },
  { slug: 'engradados', stage: 'Expedição', alt: 'Engradados de grande porte empilhados, com símbolos de manuseio', focus: 0.5 },
  { slug: 'caminhao', stage: 'Expedição', alt: 'Caminhão carregado com engradados e pallets, amarrados com cintas para a entrega', focus: 0.55 },
];
