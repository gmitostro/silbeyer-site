/**
 * Controle da abertura. A animação em si é CSS (Intro.astro); aqui ficam
 * apenas: pular, encerrar com qualquer interação e remover o nó ao final.
 */
export function initIntro(): void {
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro) return;

  const active = root.classList.contains('intro-play') || root.classList.contains('intro-static');
  if (!active) {
    intro.remove();
    return;
  }

  const skipButton = intro.querySelector<HTMLButtonElement>('[data-intro-skip]');
  let finished = false;
  let leaveTimer = 0;

  const finish = () => {
    if (finished) return;
    finished = true;
    const hadFocus = intro.contains(document.activeElement);
    cleanup();
    intro.remove();
    root.classList.add('intro-done');
    if (hadFocus) document.getElementById('conteudo')?.focus({ preventScroll: true });
  };

  const skip = () => {
    if (finished || intro.classList.contains('is-leaving')) return;
    root.classList.add('intro-skip');
    intro.classList.add('is-leaving');
    leaveTimer = window.setTimeout(finish, 360);
  };

  const onAnimationEnd = (event: AnimationEvent) => {
    if (event.target !== intro) return;
    if (event.animationName.includes('intro-exit') || event.animationName.includes('intro-out')) finish();
  };

  const onKey = (event: KeyboardEvent) => {
    if (['Tab', 'Shift', 'Alt', 'Control', 'Meta'].includes(event.key)) return;
    if (event.target === skipButton && (event.key === 'Enter' || event.key === ' ')) return;
    skip();
  };

  const onPointer = (event: PointerEvent) => {
    if (skipButton && skipButton.contains(event.target as Node)) return;
    skip();
  };

  // Rede de segurança: a abertura nunca passa de ~4 s, mesmo se algum evento falhar.
  const safety = window.setTimeout(finish, 4200);

  function cleanup() {
    window.clearTimeout(safety);
    window.clearTimeout(leaveTimer);
    intro!.removeEventListener('animationend', onAnimationEnd);
    intro!.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('wheel', skip);
    window.removeEventListener('touchmove', skip);
    window.removeEventListener('keydown', onKey);
  }

  intro.addEventListener('animationend', onAnimationEnd);
  intro.addEventListener('pointerdown', onPointer);
  skipButton?.addEventListener('click', skip);
  window.addEventListener('wheel', skip, { passive: true });
  window.addEventListener('touchmove', skip, { passive: true });
  window.addEventListener('keydown', onKey);
}
