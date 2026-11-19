/**
 * Carrossel da galeria — "montagem por ripas".
 * A foto seguinte é montada em três ripas horizontais que entram uma após a
 * outra, no sentido da navegação; quando a última encaixa, as juntas somem e a
 * foto passa a ser a base. Com movimento reduzido, a troca é imediata.
 */

import { asset } from '../lib/paths';

const SLATS = 3;
const DURATION = 760;
const STAGGER = 120;
const EASE = 'cubic-bezier(0.22, 0.75, 0.12, 1)';

interface Slide {
  slug: string;
  stage: string;
  alt: string;
  focus: number;
}

const pad = (n: number) => String(n).padStart(2, '0');
const srcFor = (slug: string) => asset(`/fotos/galeria/${slug}-1600.webp`);
const srcsetFor = (slug: string) =>
  `${asset(`/fotos/galeria/${slug}-960.webp`)} 960w, ${asset(`/fotos/galeria/${slug}-1600.webp`)} 1600w`;

export function initGallery(): void {
  const root = document.querySelector<HTMLElement>('[data-gallery]');
  if (!root) return;

  const stage = root.querySelector<HTMLElement>('[data-gallery-stage]')!;
  const base = root.querySelector<HTMLImageElement>('[data-gallery-base]')!;
  const slatsBox = root.querySelector<HTMLElement>('[data-gallery-slats]')!;
  const code = root.querySelector<HTMLElement>('[data-gallery-code]')!;
  const stageName = root.querySelector<HTMLElement>('[data-gallery-stage-name]')!;
  const current = root.querySelector<HTMLElement>('[data-gallery-current]')!;
  const fill = root.querySelector<HTMLElement>('[data-gallery-fill]')!;
  const caption = root.querySelector<HTMLElement>('[data-gallery-caption]')!;
  const thumbsList = root.querySelector<HTMLElement>('[data-gallery-thumbs]')!;
  const thumbs = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-gallery-thumb]'));
  const sizes = root.dataset.sizes ?? '100vw';

  const slides: Slide[] = thumbs.map((t) => ({
    slug: t.dataset.slug!,
    stage: t.dataset.stage!,
    alt: t.dataset.alt!,
    focus: Number(t.dataset.focus ?? 0.5),
  }));
  const total = slides.length;
  const reduced = () => document.documentElement.classList.contains('reduce-motion');

  let index = 0;
  let running: { animations: Animation[]; finish: () => void } | null = null;

  const setBase = (s: Slide) => {
    base.srcset = srcsetFor(s.slug);
    base.src = srcFor(s.slug);
    base.alt = s.alt;
    base.style.setProperty('--fy', `${s.focus * 100}%`);
  };

  const updateUi = (i: number) => {
    const s = slides[i];
    code.textContent = `F—${pad(i + 1)}`;
    stageName.textContent = s.stage;
    current.textContent = pad(i + 1);
    fill.style.setProperty('--progress', String(total > 1 ? i / (total - 1) : 1));
    caption.innerHTML = '';
    const hidden = document.createElement('span');
    hidden.className = 'visually-hidden';
    hidden.textContent = `Foto ${i + 1} de ${total}. `;
    caption.append(hidden, `${s.alt}.`);
    thumbs.forEach((t, k) => (k === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
    const thumb = thumbs[i];
    const left = thumb.offsetLeft - (thumbsList.clientWidth - thumb.offsetWidth) / 2;
    thumbsList.scrollTo({ left, behavior: reduced() ? 'auto' : 'smooth' });
  };

  const preload = (i: number) => {
    const s = slides[(i + total) % total];
    const img = new Image();
    img.sizes = sizes;
    img.srcset = srcsetFor(s.slug);
    img.src = srcFor(s.slug);
  };

  /** Monta a foto `s` em ripas sobre a base, entrando pela direita (dir 1) ou pela esquerda (dir -1). */
  const assemble = (s: Slide, dir: 1 | -1) => {
    slatsBox.innerHTML = '';
    const animations: Animation[] = [];
    const from = dir === 1 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';

    for (let k = 0; k < SLATS; k++) {
      const slat = document.createElement('div');
      slat.className = 'gallery__slat';
      slat.style.setProperty('--k', String(k));
      const img = document.createElement('img');
      img.alt = '';
      img.sizes = sizes;
      img.srcset = srcsetFor(s.slug);
      img.src = srcFor(s.slug);
      img.style.setProperty('--fy', `${s.focus * 100}%`);
      slat.append(img);
      slatsBox.append(slat);

      // Ripas de cima para baixo no avanço, de baixo para cima no retorno.
      const order = dir === 1 ? k : SLATS - 1 - k;
      const delay = order * STAGGER;
      animations.push(
        slat.animate(
          [
            { clipPath: from, '--seam': 1 },
            { clipPath: 'inset(0 0 0 0)', '--seam': 1, offset: 0.85 },
            { clipPath: 'inset(0 0 0 0)', '--seam': 0 },
          ] as Keyframe[],
          { duration: DURATION, delay, easing: EASE, fill: 'both' },
        ),
        img.animate([{ transform: `translateX(${dir * 7}%)` }, { transform: 'translateX(0)' }], {
          duration: DURATION,
          delay,
          easing: EASE,
          fill: 'both',
        }),
      );
    }

    // A foto que sai recua levemente enquanto as ripas a cobrem.
    const span = DURATION + STAGGER * (SLATS - 1);
    animations.push(
      base.animate([{ filter: 'brightness(1)', transform: 'scale(1)' }, { filter: 'brightness(0.55)', transform: 'scale(0.985)' }], {
        duration: span,
        easing: EASE,
      }),
    );

    const finish = () => {
      setBase(s);
      slatsBox.innerHTML = '';
      running = null;
    };
    Promise.all(animations.map((a) => a.finished))
      .then(finish)
      .catch(() => {});
    running = { animations, finish };
  };

  const go = async (target: number, dir?: 1 | -1) => {
    const next = (target + total) % total;
    if (next === index && !running) return;
    const direction = dir ?? (next > index ? 1 : -1);

    // Um clique durante a montagem conclui a anterior na hora.
    if (running) {
      const r = running;
      r.animations.forEach((a) => a.cancel());
      r.finish();
    }

    index = next;
    const s = slides[index];
    updateUi(index);

    if (reduced() || typeof stage.animate !== 'function') {
      setBase(s);
    } else {
      // Espera a foto decodificar para a montagem não começar vazia.
      const probe = new Image();
      probe.sizes = sizes;
      probe.srcset = srcsetFor(s.slug);
      probe.src = srcFor(s.slug);
      try {
        await probe.decode();
      } catch {
        // Segue mesmo assim; a ripa mostra o fundo da moldura até carregar.
      }
      if (slides[index] !== s) return; // outro clique chegou antes
      assemble(s, direction);
    }
    preload(index + 1);
    preload(index - 1);
  };

  root.querySelector('[data-gallery-prev]')?.addEventListener('click', () => go(index - 1, -1));
  root.querySelector('[data-gallery-next]')?.addEventListener('click', () => go(index + 1, 1));
  thumbs.forEach((t, i) =>
    t.addEventListener('click', (e) => {
      e.preventDefault();
      go(i);
    }),
  );

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1, 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1, -1);
    }
  });

  // Arrastar no palco (toque ou mouse).
  let startX: number | null = null;
  stage.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => (startX = null));

  // Começa a carregar a primeira foto só quando a galeria se aproxima da tela.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          base.loading = 'eager';
          preload(1);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(root);
  }
}
