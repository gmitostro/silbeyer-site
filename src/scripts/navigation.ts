/**
 * Cabeçalho (estado sólido), seção ativa, menu móvel e barra de ação.
 */

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const update = () => header.classList.toggle('is-solid', window.scrollY > 12);
  // Primeira leitura no próximo quadro, para não forçar layout durante o carregamento.
  requestAnimationFrame(update);
  window.addEventListener('scroll', update, { passive: true });
}

export function initActiveSection(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map((link) => [link.dataset.navLink!, link]));
  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  const visible = new Set<string>();

  const setCurrent = () => {
    // A seção ativa é a última (na ordem do documento) que cruza a faixa central.
    const current = sections.filter((s) => visible.has(s.id)).pop();
    links.forEach((link) => {
      if (current && link.dataset.navLink === current.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      setCurrent();
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

export function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!toggle || !menu || !header) return;

  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');
  const outside = () => Array.from(document.querySelectorAll<HTMLElement>('main, footer, [data-action-bar]'));
  const desktop = window.matchMedia('(min-width: 64em)');
  let isOpen = false;

  const focusables = () =>
    Array.from(
      header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ).filter((el) => el.offsetParent !== null || el === toggle);

  const open = () => {
    isOpen = true;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-visible'));
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Fechar';
    header.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    outside().forEach((el) => el.setAttribute('inert', ''));
    menu.querySelector<HTMLElement>('a')?.focus();
  };

  const close = (returnFocus = true) => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('is-visible');
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Menu';
    header.classList.remove('is-open');
    document.body.style.overflow = '';
    outside().forEach((el) => el.removeAttribute('inert'));
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (isOpen ? close() : open()));

  menu.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('a');
    if (link) close(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    // Mantém o foco dentro do cabeçalho enquanto o menu está aberto.
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) close(false);
  });
}

export function initActionBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-action-bar]');
  const hero = document.getElementById('inicio');
  const hideZones = [document.getElementById('orcamento'), document.getElementById('contato')].filter(
    (el): el is HTMLElement => el !== null,
  );
  if (!bar || !hero || !('IntersectionObserver' in window)) return;

  let pastHero = false;
  const zonesInView = new Set<Element>();

  const update = () => bar.classList.toggle('is-visible', pastHero && zonesInView.size === 0);

  new IntersectionObserver(([entry]) => {
    pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(hero);

  const zoneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) zonesInView.add(entry.target);
      else zonesInView.delete(entry.target);
    });
    update();
  });
  hideZones.forEach((zone) => zoneObserver.observe(zone));
}
