/**
 * Dados institucionais da Silbeyer.
 * Toda informação de contato do site sai daqui — altere somente neste arquivo.
 *
 * - CEP informado pela empresa; logradouro e bairro conferidos na base dos
 *   Correios (ViaCEP) para o CEP 06902-245. O número 150 vem do briefing.
 * - O WhatsApp usa o mesmo número do telefone (confirmado pela empresa).
 */

import { asset } from '../lib/paths';

const addressStreet = 'Rua Leonardo Scacciotti Neto, 150';
const addressDistrict = 'Flórida';
const addressCity = 'Embu-Guaçu';
const addressState = 'SP';
const addressPostalCode = '06902-245';
const addressFull = `${addressStreet} - ${addressDistrict}, ${addressCity} - ${addressState}, ${addressPostalCode}`;

export const company = {
  name: 'Silbeyer Embalagens de Madeira',
  shortName: 'Silbeyer',
  descriptor: 'Embalagens de Madeira',
  phone: {
    display: '(11) 4661-3691',
    href: 'tel:+551146613691',
    international: '+55 11 4661-3691',
  },
  /** Formato internacional exigido pelo wa.me: país (55) + DDD (11) + número. */
  whatsappNumber: '551146613691',
  address: {
    street: addressStreet,
    district: addressDistrict,
    city: addressCity,
    state: addressState,
    postalCode: addressPostalCode,
    full: addressFull,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFull)}`,
  },
} as const;

/**
 * Espaço reservado para o logotipo oficial.
 * Quando o arquivo aprovado estiver disponível, salve-o em /public/brand/
 * e preencha `src`, `width` e `height` com as dimensões reais do arquivo.
 * Enquanto `src` for null, o site usa uma composição tipográfica temporária
 * (não é o logotipo oficial).
 */
export const brandLogo: {
  src: string | null;
  srcOnLight: string | null;
  /** Versão compacta (símbolo + nome, sem o descritivo) para o cabeçalho, onde a linha "Embalagens de Madeira" ficaria ilegível. */
  srcCompact: string | null;
  width: number;
  height: number;
  compactWidth: number;
  compactHeight: number;
} = {
  // Conceito D — Ripas (logo escolhida; referência em assets-originais/logo-ripas-referencia.jpg,
  // com o "S" maiúsculo). Outros conceitos: /brand/a-monograma/, /brand/b-wordmark/, /brand/c-selo/.
  src: asset('/brand/d-ripas/horizontal-escuro.svg'), // versão para fundos escuros
  srcOnLight: asset('/brand/d-ripas/horizontal-claro.svg'), // versão para fundos claros
  srcCompact: asset('/brand/d-ripas/compacto-escuro.svg'),
  width: 321,
  height: 100,
  compactWidth: 312,
  compactHeight: 100,
};

/**
 * Política de movimento.
 * - 'always': animações (abertura e rolagem) sempre ligadas.
 * - 'system': respeita "reduzir movimento" do sistema operacional do visitante
 *   (em Windows Server / máquinas com efeitos visuais desligados, isso esconde
 *   todas as animações — foi o que acontecia nos testes locais).
 */
export const motion: 'always' | 'system' = 'always';

export const seo = {
  title: 'Silbeyer Embalagens de Madeira | Embalagens industriais sob medida',
  description:
    'Fabricante de embalagens de madeira sob medida em Embu-Guaçu, SP: engradados, caixas e embalagens para máquinas e equipamentos. Solicite um orçamento pelo WhatsApp.',
  locale: 'pt_BR',
};

export const navigation = [
  { href: '#solucoes', label: 'Soluções', id: 'solucoes' },
  { href: '#processo', label: 'Processo', id: 'processo' },
  { href: '#criterios', label: 'Critérios', id: 'criterios' },
  { href: '#aplicacoes', label: 'Aplicações', id: 'aplicacoes' },
  { href: '#galeria', label: 'Galeria', id: 'galeria' },
  { href: '#contato', label: 'Contato', id: 'contato' },
] as const;
