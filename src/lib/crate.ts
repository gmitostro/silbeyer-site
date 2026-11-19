/**
 * Geometria isométrica de uma embalagem de madeira (engradado fechado com
 * sarrafos, travessas diagonais e esquis). Gera os caminhos SVG em tempo de
 * build; a mesma peça alimenta a abertura, o desenho técnico do processo e as
 * ilustrações de linha.
 *
 * Eixos do modelo: x = comprimento, y = largura, z = altura.
 * Projeção: isométrica clássica (30°).
 */

export type V3 = readonly [number, number, number];
type V2 = readonly [number, number];

const COS30 = Math.cos(Math.PI / 6);

const round = (n: number) => Math.round(n * 10) / 10;

export interface CrateSpec {
  W: number;
  D: number;
  H: number;
  /** Altura dos esquis (base). */
  skid: number;
  /** Largura dos sarrafos (cleats). */
  t: number;
  /** Distância das cotas até a peça. */
  dimOffset: number;
  pad: number;
}

export const defaultCrateSpec: CrateSpec = {
  W: 320,
  D: 210,
  H: 220,
  skid: 26,
  t: 15,
  dimOffset: 44,
  pad: 36,
};

export interface DimLine {
  d: string;
  ext: string;
  ticks: string;
  label: { x: number; y: number; angle: number };
  /** Rótulo associado: c = comprimento, l = largura, a = altura. */
  axis: 'c' | 'l' | 'a';
}

export interface Part {
  /** Deslocamento inicial em coordenadas de tela (para a montagem). */
  from: V2;
  polys: { d: string; cls: string }[];
  lines: { d: string; cls: string }[];
}

export interface CrateGeometry {
  viewBox: string;
  width: number;
  height: number;
  guides: string[];
  product: string[];
  hidden: string[];
  outline: string[];
  dims: DimLine[];
  inner: Part;
  skids: Part;
  left: Part;
  right: Part;
  cleatsLeft: Part;
  cleatsRight: Part;
  lid: Part;
  straps: Part;
  marks: Part;
}

export function buildCrate(spec: CrateSpec = defaultCrateSpec): CrateGeometry {
  const { W, D, H, skid, t, dimOffset: o, pad } = spec;

  const raw = ([x, y, z]: V3): V2 => [(x - y) * COS30, (x + y) * 0.5 - z];

  // Caixa delimitadora (peça + cotas) para centralizar o viewBox.
  const bboxPts: V3[] = [
    [0, 0, H],
    [W, 0, H],
    [W, D, H],
    [0, D, H],
    [W, D, -skid],
    [W, 0, -skid],
    [0, D, -skid],
    [0, D + o + 14, -skid],
    [W, D + o + 14, -skid],
    [W + o + 14, 0, -skid],
    [W + o + 14, D, -skid],
    [-o - 14, D, -skid],
    [-o - 14, D, H],
  ];
  const projected = bboxPts.map(raw);
  const minX = Math.min(...projected.map((p) => p[0])) - pad;
  const maxX = Math.max(...projected.map((p) => p[0])) + pad;
  const minY = Math.min(...projected.map((p) => p[1])) - pad;
  const maxY = Math.max(...projected.map((p) => p[1])) + pad;

  const P = (p: V3): V2 => {
    const [x, y] = raw(p);
    return [round(x - minX), round(y - minY)];
  };
  const path = (pts: V3[], close = false) =>
    'M' + pts.map((p) => P(p).join(' ')).join('L') + (close ? 'Z' : '');
  const seg = (a: V3, b: V3) => path([a, b]);

  // Mapas de face: (u, v) -> ponto 3D.
  const faceLeft = (u: number, v: number): V3 => [u, D, v]; // face frontal esquerda (y = D)
  const faceRight = (u: number, v: number): V3 => [W, D - u, v]; // face frontal direita (x = W)
  const faceTop = (u: number, v: number): V3 => [u, v, H];
  type Face = (u: number, v: number) => V3;

  const rect = (f: Face, u0: number, v0: number, u1: number, v1: number) =>
    path([f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)], true);

  const band = (f: Face, u0: number, v0: number, u1: number, v1: number, w: number) => {
    const du = u1 - u0;
    const dv = v1 - v0;
    const len = Math.hypot(du, dv);
    const nu = (-dv / len) * (w / 2);
    const nv = (du / len) * (w / 2);
    return path(
      [f(u0 + nu, v0 + nv), f(u1 + nu, v1 + nv), f(u1 - nu, v1 - nv), f(u0 - nu, v0 - nv)],
      true,
    );
  };

  const slide = (dir: V3, k: number): V2 => {
    const [x, y] = raw([dir[0] * k, dir[1] * k, dir[2] * k]);
    return [round(x), round(y)];
  };

  // Arestas visíveis de um bloco (vista isométrica padrão).
  const blockEdges = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => [
    seg([x0, y0, z1], [x1, y0, z1]),
    seg([x1, y0, z1], [x1, y1, z1]),
    seg([x1, y1, z1], [x0, y1, z1]),
    seg([x0, y1, z1], [x0, y0, z1]),
    seg([x0, y1, z0], [x0, y1, z1]),
    seg([x1, y1, z0], [x1, y1, z1]),
    seg([x1, y0, z0], [x1, y0, z1]),
    seg([x0, y1, z0], [x1, y1, z0]),
    seg([x1, y1, z0], [x1, y0, z0]),
  ];

  // --- Linhas de construção ---
  const g = 90;
  const guides = [
    seg([-g, D, -skid], [W + g, D, -skid]),
    seg([W, D + g, -skid], [W, -g, -skid]),
    seg([0, D, -skid - g * 0.4], [0, D, H + g]),
    seg([W, 0, -skid - g * 0.4], [W, 0, H + g]),
    seg([-g * 0.6, 0, H], [W + g * 0.6, 0, H]),
    seg([0, -g * 0.6, H], [0, D + g * 0.6, H]),
  ];

  // --- Carga (equipamento dentro da embalagem) ---
  const product = [
    ...blockEdges(26, W - 26, 24, D - 24, 0, H * 0.6),
    ...blockEdges(W * 0.16, W * 0.54, D * 0.28, D * 0.72, H * 0.6, H * 0.86),
  ];

  // --- Envelope ---
  const hidden = [seg([0, 0, 0], [W, 0, 0]), seg([0, 0, 0], [0, D, 0]), seg([0, 0, 0], [0, 0, H])];
  const outline = blockEdges(0, W, 0, D, 0, H);

  // --- Cotas ---
  const tick = (p: V3) => {
    const [x, y] = P(p);
    return `M${round(x - 5)} ${round(y + 5)}L${round(x + 5)} ${round(y - 5)}`;
  };
  const center = P([W / 2, D / 2, H / 2]);
  const labelFor = (a: V3, b: V3, angle: number, dist = 15) => {
    const pa = P(a);
    const pb = P(b);
    const mx = (pa[0] + pb[0]) / 2;
    const my = (pa[1] + pb[1]) / 2;
    const dx = pb[0] - pa[0];
    const dy = pb[1] - pa[1];
    const len = Math.hypot(dx, dy);
    let nx = -dy / len;
    let ny = dx / len;
    if ((mx + nx - center[0]) ** 2 + (my + ny - center[1]) ** 2 < (mx - center[0]) ** 2 + (my - center[1]) ** 2) {
      nx = -nx;
      ny = -ny;
    }
    return { x: round(mx + nx * dist), y: round(my + ny * dist), angle };
  };
  const zb = -skid;
  const dims: DimLine[] = [
    {
      axis: 'c',
      d: seg([0, D + o, zb], [W, D + o, zb]),
      ext: seg([0, D + 6, zb], [0, D + o + 8, zb]) + seg([W, D + 6, zb], [W, D + o + 8, zb]),
      ticks: tick([0, D + o, zb]) + tick([W, D + o, zb]),
      label: labelFor([0, D + o, zb], [W, D + o, zb], 30),
    },
    {
      axis: 'l',
      d: seg([W + o, D, zb], [W + o, 0, zb]),
      ext: seg([W + 6, D, zb], [W + o + 8, D, zb]) + seg([W + 6, 0, zb], [W + o + 8, 0, zb]),
      ticks: tick([W + o, D, zb]) + tick([W + o, 0, zb]),
      label: labelFor([W + o, D, zb], [W + o, 0, zb], -30),
    },
    {
      axis: 'a',
      d: seg([-o, D, zb], [-o, D, H]),
      ext: seg([-6, D, zb], [-o - 8, D, zb]) + seg([-6, D, H], [-o - 8, D, H]),
      ticks: tick([-o, D, zb]) + tick([-o, D, H]),
      label: labelFor([-o, D, zb], [-o, D, H], -90, 16),
    },
  ];

  // --- Paredes internas (visíveis pela abertura antes da tampa) ---
  const inner: Part = {
    from: [0, 0],
    polys: [
      { d: path([[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]], true), cls: 'pf pf-inner' },
      { d: path([[0, 0, 0], [0, D, 0], [0, D, H], [0, 0, H]], true), cls: 'pf pf-inner-2' },
    ],
    lines: [],
  };

  // --- Esquis ---
  const s = 30;
  const skids: Part = {
    from: slide([-1, 0, 0], 70),
    polys: [
      { d: path([[W, 0, 0], [W, s, 0], [W, s, zb], [W, 0, zb]], true), cls: 'pf pf-right' },
      {
        d: path([[W, D / 2 - s / 2, 0], [W, D / 2 + s / 2, 0], [W, D / 2 + s / 2, zb], [W, D / 2 - s / 2, zb]], true),
        cls: 'pf pf-right',
      },
      { d: path([[0, D, 0], [W, D, 0], [W, D, zb], [0, D, zb]], true), cls: 'pf pf-left' },
      { d: path([[W, D - s, 0], [W, D, 0], [W, D, zb], [W, D - s, zb]], true), cls: 'pf pf-right' },
    ],
    lines: [],
  };

  // --- Painéis laterais com juntas de tábuas ---
  const seamsZ = [H / 4, H / 2, (3 * H) / 4];
  const left: Part = {
    from: slide([0, 1, 0], 44),
    polys: [{ d: rect(faceLeft, 0, 0, W, H), cls: 'pf pf-left' }],
    lines: seamsZ.map((z) => ({ d: seg([0, D, z], [W, D, z]), cls: 'seam' })),
  };
  const right: Part = {
    from: slide([1, 0, 0], 44),
    polys: [{ d: rect(faceRight, 0, 0, D, H), cls: 'pf pf-right' }],
    lines: seamsZ.map((z) => ({ d: seg([W, D, z], [W, 0, z]), cls: 'seam' })),
  };

  // --- Sarrafos e travessas ---
  const h2 = t * 0.9;
  const cleatsLeft: Part = {
    from: slide([0, 1, 0], 18),
    polys: [
      { d: band(faceLeft, t, t, W / 2 - t / 2, H - t, h2), cls: 'pf cl-left' },
      { d: band(faceLeft, W - t, t, W / 2 + t / 2, H - t, h2), cls: 'pf cl-left' },
      { d: rect(faceLeft, 0, 0, W, t), cls: 'pf cl-left' },
      { d: rect(faceLeft, 0, H - t, W, H), cls: 'pf cl-left' },
      { d: rect(faceLeft, 0, t, t, H - t), cls: 'pf cl-left' },
      { d: rect(faceLeft, W - t, t, W, H - t), cls: 'pf cl-left' },
      { d: rect(faceLeft, W / 2 - t / 2, t, W / 2 + t / 2, H - t), cls: 'pf cl-left' },
    ],
    lines: [],
  };
  const cleatsRight: Part = {
    from: slide([1, 0, 0], 18),
    polys: [
      { d: band(faceRight, t, t, D - t, H - t, h2), cls: 'pf cl-right' },
      { d: rect(faceRight, 0, 0, D, t), cls: 'pf cl-right' },
      { d: rect(faceRight, 0, H - t, D, H), cls: 'pf cl-right' },
      { d: rect(faceRight, 0, t, t, H - t), cls: 'pf cl-right' },
      { d: rect(faceRight, D - t, t, D, H - t), cls: 'pf cl-right' },
    ],
    lines: [],
  };

  // --- Tampa ---
  const lid: Part = {
    from: [0, -56],
    polys: [
      { d: rect(faceTop, 0, 0, W, D), cls: 'pf pf-top' },
      { d: rect(faceTop, 0, 0, W, t), cls: 'pf cl-top' },
      { d: rect(faceTop, 0, D - t, W, D), cls: 'pf cl-top' },
      { d: rect(faceTop, 0, t, t, D - t), cls: 'pf cl-top' },
      { d: rect(faceTop, W - t, t, W, D - t), cls: 'pf cl-top' },
      { d: rect(faceTop, W / 2 - t / 2, t, W / 2 + t / 2, D - t), cls: 'pf cl-top' },
    ],
    lines: [D / 3, (2 * D) / 3].map((y) => ({ d: seg([t, y, H], [W - t, y, H]), cls: 'seam' })),
  };

  // --- Cintas ---
  const strapAt = [W * 0.25, W * 0.75];
  const straps: Part = {
    from: [0, 0],
    polys: strapAt.flatMap((u) => [
      { d: rect(faceTop, u - 3.5, 0, u + 3.5, D), cls: 'pf strap' },
      { d: rect(faceLeft, u - 3.5, 0, u + 3.5, H), cls: 'pf strap' },
    ]),
    lines: [],
  };

  // --- Marcações de manuseio ("este lado para cima") e placa de identificação ---
  const arrow = (u: number, v: number) =>
    path([faceLeft(u, v), faceLeft(u, v + 30)]) +
    path([faceLeft(u - 6, v + 22), faceLeft(u, v + 30), faceLeft(u + 6, v + 22)]);
  const mu = W * 0.83;
  const mv = H * 0.58;
  const pu = W * 0.36;
  const pv = H * 0.17;
  const marks: Part = {
    from: [0, 0],
    polys: [{ d: rect(faceLeft, pu - 24, pv, pu + 24, pv + 24), cls: 'pf plate' }],
    lines: [
      { d: arrow(mu - 8, mv) + arrow(mu + 8, mv) + path([faceLeft(mu - 16, mv - 6), faceLeft(mu + 16, mv - 6)]), cls: 'mark' },
      { d: path([faceLeft(pu - 16, pv + 15), faceLeft(pu + 16, pv + 15)]), cls: 'mark mark--thin' },
      { d: path([faceLeft(pu - 16, pv + 9), faceLeft(pu + 6, pv + 9)]), cls: 'mark mark--thin' },
    ],
  };

  const width = round(maxX - minX);
  const height = round(maxY - minY);

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    guides,
    product,
    hidden,
    outline,
    dims,
    inner,
    skids,
    left,
    right,
    cleatsLeft,
    cleatsRight,
    lid,
    straps,
    marks,
  };
}
