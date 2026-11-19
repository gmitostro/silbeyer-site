/**
 * Coreografia de rolagem (GSAP + ScrollTrigger).
 * Carregado sob demanda e somente quando o movimento é permitido; todo o
 * conteúdo já está visível e completo sem este módulo.
 *
 * Família de interações:
 *  - Régua das seções: a linha de medida se desenha ao entrar.
 *  - Desenho técnico do processo: a embalagem é construída conforme a rolagem.
 *  - Composição em camadas (critérios): as tábuas se afastam e revelam a estrutura.
 *  - Revelação de fotos: recorte (clip-path) na direção da composição.
 *  - Medidor do hero: acompanha a saída do hero.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';

export function initMotion(): void {
  document.documentElement.classList.add('motion-ready');
  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 64em)',
      mobile: '(max-width: 63.99em)',
    },
    (context) => {
      // Movimento reduzido já foi tratado em main.ts (este módulo nem é carregado).
      const { desktop } = context.conditions as { desktop: boolean; mobile: boolean };
      document.documentElement.classList.add('motion-ready');

      sectionRulers();
      imageReveals();
      heroGauge();
      processDrawing(desktop);
      processSteps();
      layeredBoards();
      criteriaRules();
      quoteBackdrop();

      return () => document.documentElement.classList.remove('motion-ready');
    },
  );

  // Fontes e fotos podem alterar alturas: recalcula os gatilhos.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

function sectionRulers(): void {
  document.querySelectorAll<HTMLElement>('.ruler').forEach((ruler) => {
    const parent = ruler.parentElement;
    const title = parent?.querySelector('h2');
    const text = parent?.querySelector('.section-head__text, .quote__text');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ruler, start: 'top 88%', once: true },
    });
    tl.from(ruler.querySelector('.ruler__line'), { scaleX: 0, duration: 1.1, ease: 'power3.inOut' })
      .from(ruler.querySelector('.ruler__ticks'), { scaleX: 0, duration: 1.3, ease: 'power3.inOut' }, 0.08);
    if (title) tl.from(title, { y: 28, opacity: 0, duration: 0.9, ease: EASE }, 0.15);
    if (text) tl.from(text, { y: 18, opacity: 0, duration: 0.9, ease: EASE }, 0.3);
  });
}

function imageReveals(): void {
  const insets: Record<string, string> = {
    up: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  };
  document.querySelectorAll<HTMLElement>('[data-reveal-image]').forEach((wrap) => {
    const from = insets[wrap.dataset.revealFrom ?? 'up'] ?? insets.up;
    const img = wrap.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top 85%', once: true } });
    tl.fromTo(
      wrap,
      { clipPath: from },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power3.inOut', clearProps: 'clipPath' },
    );
    if (img) tl.from(img, { scale: 1.12, duration: 1.6, ease: EASE, clearProps: 'transform' }, 0);
  });
}

function heroGauge(): void {
  const fill = document.querySelector<HTMLElement>('[data-hero-gauge]');
  const hero = document.getElementById('inicio');
  if (!fill || !hero) return;
  gsap.fromTo(
    fill,
    { scaleY: 0 },
    { scaleY: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 } },
  );
}

/** Constrói o desenho isométrico por etapas, sincronizado com os passos do processo. */
function processDrawing(desktop: boolean): void {
  const svg = document.getElementById('process-crate');
  const steps = document.querySelector<HTMLElement>('.process__steps');
  if (!svg || !steps) return;

  const q = (sel: string) => Array.from(svg.querySelectorAll<SVGElement>(sel));
  const draws = (sel: string) => q(sel);
  const part = (sel: string) => svg.querySelector<SVGGElement>(sel);
  const offset = (el: SVGGElement | null) => {
    if (!el) return { x: 0, y: 0 };
    const style = getComputedStyle(el);
    return { x: parseFloat(style.getPropertyValue('--fx')) || 0, y: parseFloat(style.getPropertyValue('--fy')) || 0 };
  };

  const allDraws = draws('.draw');
  gsap.set(allDraws, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(q('.cr-hidden, .cr-dims .ln--tick, .cr-dims .dim-label, .cr-inner, .cr-straps, .cr-marks'), { opacity: 0 });
  const assembled = ['.cr-skids', '.cr-left', '.cr-right', '.cr-cleats-l', '.cr-cleats-r', '.cr-lid'];
  assembled.forEach((sel) => {
    const el = part(sel);
    const o = offset(el);
    if (el) gsap.set(el, { x: o.x, y: o.y, opacity: 0 });
  });

  const tl = gsap.timeline({ defaults: { ease: 'none' } });

  // Etapa 1 — entender a carga
  tl.addLabel('s1')
    .to(draws('.cr-guides .draw'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.05 }, 's1')
    .to(draws('.cr-product .draw'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.02 }, 's1+=0.3');

  // Etapa 2 — especificar: envelope e cotas
  tl.addLabel('s2', 1)
    .to(draws('.cr-outline .draw'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.025 }, 's2')
    .to(q('.cr-hidden'), { opacity: 1, duration: 0.3 }, 's2+=0.2')
    .to(draws('.cr-dims .draw'), { strokeDashoffset: 0, duration: 0.4, stagger: 0.08 }, 's2+=0.35')
    .to(q('.cr-dims .ln--tick, .cr-dims .dim-label'), { opacity: 1, duration: 0.25, stagger: 0.05 }, 's2+=0.6');

  // Etapa 3 — fabricar: esquis, painéis, sarrafos
  tl.addLabel('s3', 2)
    .to(q('.cr-guides'), { opacity: 0.3, duration: 0.4 }, 's3')
    .to(q('.cr-inner'), { opacity: 1, duration: 0.2 }, 's3')
    .to(part('.cr-skids'), { x: 0, y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 's3')
    .to(part('.cr-left'), { x: 0, y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 's3+=0.15')
    .to(part('.cr-right'), { x: 0, y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 's3+=0.3')
    .to([part('.cr-cleats-l'), part('.cr-cleats-r')], { x: 0, y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power2.out' }, 's3+=0.55');

  // Etapa 4 — preparar: tampa, cintas e marcações
  tl.addLabel('s4', 3)
    .to(part('.cr-lid'), { x: 0, y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 's4')
    .to(q('.cr-straps'), { opacity: 1, duration: 0.25 }, 's4+=0.4')
    .to(q('.cr-marks'), { opacity: 1, duration: 0.25 }, 's4+=0.55')
    .to(q('.cr-dims'), { opacity: 0.55, duration: 0.3 }, 's4+=0.5')
    .set({}, {}, 4);

  if (desktop) {
    ScrollTrigger.create({
      animation: tl,
      trigger: steps,
      start: 'top 62%',
      end: 'bottom 62%',
      scrub: 0.6,
    });
  } else {
    tl.pause();
    ScrollTrigger.create({
      trigger: svg,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        tl.timeScale(1.6).play();
      },
    });
  }
}

function processSteps(): void {
  const label = document.querySelector<HTMLElement>('[data-stage-current]');
  const steps = Array.from(document.querySelectorAll<HTMLElement>('.step'));
  steps.forEach((step, i) => {
    gsap.fromTo(
      step,
      { '--step-progress': 0 },
      {
        '--step-progress': 1,
        ease: 'none',
        scrollTrigger: { trigger: step, start: 'top 62%', end: 'bottom 62%', scrub: true },
      },
    );
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      end: 'bottom 62%',
      onToggle: (self) => {
        step.classList.toggle('is-active', self.isActive);
        if (self.isActive && label) label.textContent = String(i + 1).padStart(2, '0');
      },
    });
  });
}

function layeredBoards(): void {
  const layers = document.querySelector<HTMLElement>('[data-layers]');
  if (!layers) return;
  const boards = Array.from(layers.querySelectorAll<HTMLElement>('[data-board]'));
  const middle = (boards.length - 1) / 2;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: layers, start: 'top 85%', end: 'center 40%', scrub: 0.5 },
  });
  boards.forEach((board, i) => {
    tl.fromTo(board, { y: 0, x: 0 }, { y: (i - middle) * 9, x: i % 2 === 0 ? -5 : 5, duration: 1 }, 0);
  });
}

function criteriaRules(): void {
  document.querySelectorAll<HTMLElement>('[data-criterion-rule]').forEach((rule) => {
    gsap.from(rule, {
      scaleX: 0,
      duration: 1,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: rule, start: 'top 90%', once: true },
    });
  });
}

function quoteBackdrop(): void {
  const crate = document.querySelector<SVGElement>('.quote__crate');
  if (!crate) return;
  const lines = crate.querySelectorAll('.draw');
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.to(lines, {
    strokeDashoffset: 0,
    duration: 1.4,
    stagger: 0.04,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: '#orcamento', start: 'top 70%', once: true },
  });
}
