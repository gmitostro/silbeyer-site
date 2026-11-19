import { initIntro } from './intro';
import { initActionBar, initActiveSection, initHeader, initMobileMenu } from './navigation';
import { initQuoteForm } from './quote-form';

/** Fotos que falharem exibem o fundo neutro da moldura em vez do ícone quebrado. */
function initImageFallbacks(): void {
  document.querySelectorAll<HTMLImageElement>('.photo img, .layers__board img').forEach((img) => {
    const markMissing = () => img.closest('.photo, .layers__board')?.classList.add('is-missing');
    // "complete" sem largura pode ser só uma foto ainda decodificando: confirma antes de esconder.
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) img.decode().catch(markMissing);
    img.addEventListener('error', markMissing, { once: true });
  });
}

function loadMotion(): void {
  // A decisão de movimento reduzido é tomada no <head> (BaseLayout) e exposta
  // como classe no <html>; aqui só se lê a classe.
  if (document.documentElement.classList.contains('reduce-motion')) return;
  const run = () => {
    import('./motion')
      .then(({ initMotion }) => initMotion())
      .catch(() => {
        // Sem a coreografia, o conteúdo continua completo e estático.
      });
  };
  // Safari ainda não implementa requestIdleCallback.
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 1200 });
  else setTimeout(run, 200);
}

initIntro();
initHeader();
initActiveSection();
initMobileMenu();
initActionBar();
initQuoteForm();
initImageFallbacks();
loadMotion();
