import { whatsappUrl } from '../lib/whatsapp';

/**
 * Formulário de orçamento sem servidor: valida os campos e monta uma mensagem
 * para o WhatsApp. Nada é enviado ou armazenado pelo site — o usuário revisa e
 * envia a mensagem no próprio WhatsApp.
 */

type FieldName = 'nome' | 'tipo' | 'descricao' | 'telefone' | 'email';

const messages: Record<FieldName, { empty: string; invalid?: string }> = {
  nome: { empty: 'Informe seu nome.' },
  tipo: { empty: 'Selecione o tipo de embalagem — se ainda não souber, escolha "Ainda não sei".' },
  descricao: {
    empty: 'Descreva brevemente o que precisa ser embalado.',
    invalid: 'Escreva um pouco mais (mínimo de 15 caracteres) para entendermos a necessidade.',
  },
  telefone: {
    empty: 'Informe um telefone para retorno.',
    invalid: 'Informe o telefone com DDD, por exemplo: (11) 91234-5678.',
  },
  email: {
    empty: 'Informe um e-mail para retorno.',
    invalid: 'Informe um e-mail válido, por exemplo: nome@empresa.com.br.',
  },
};

const labels: Record<FieldName, string> = {
  nome: 'Nome',
  tipo: 'Tipo de embalagem',
  descricao: 'Descreva a necessidade',
  telefone: 'Telefone para retorno',
  email: 'E-mail para retorno',
};

export function initQuoteForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  const summary = document.querySelector<HTMLElement>('[data-error-summary]');
  const summaryList = summary?.querySelector<HTMLElement>('[data-error-list]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const contactFields = Array.from(form.querySelectorAll<HTMLElement>('[data-contact-field]'));

  const field = (name: FieldName) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

  const preference = () => (form.elements.namedItem('retorno') as RadioNodeList).value;

  const activeFields = (): FieldName[] => {
    const list: FieldName[] = ['nome', 'tipo', 'descricao'];
    if (preference() === 'Ligação') list.push('telefone');
    if (preference() === 'E-mail') list.push('email');
    return list;
  };

  const validate = (name: FieldName): string => {
    const el = field(name);
    if (!el) return '';
    const value = el.value.trim();
    if (!value) return messages[name].empty;
    if (name === 'descricao' && value.length < 15) return messages.descricao.invalid!;
    if (name === 'telefone' && value.replace(/\D/g, '').length < 10) return messages.telefone.invalid!;
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return messages.email.invalid!;
    return '';
  };

  const showError = (name: FieldName, message: string) => {
    const el = field(name);
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (!el || !slot) return;
    slot.textContent = message;
    if (message) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };

  const syncContactFields = () => {
    const pref = preference();
    contactFields.forEach((wrapper) => {
      const show = wrapper.dataset.contactField === pref;
      wrapper.hidden = !show;
      const input = wrapper.querySelector('input');
      if (input) {
        input.required = show;
        if (!show) showError(input.name as FieldName, '');
      }
    });
  };

  form.addEventListener('change', (event) => {
    if ((event.target as HTMLInputElement).name === 'retorno') syncContactFields();
  });
  syncContactFields();

  // Valida ao sair do campo (não a cada tecla); corrige o erro enquanto digita.
  (['nome', 'tipo', 'descricao', 'telefone', 'email'] as FieldName[]).forEach((name) => {
    const el = field(name);
    if (!el) return;
    el.addEventListener('blur', () => {
      if (el.value.trim() || el.hasAttribute('aria-invalid')) showError(name, validate(name));
    });
    el.addEventListener('input', () => {
      if (el.hasAttribute('aria-invalid')) showError(name, validate(name));
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (status) status.innerHTML = '';

    const errors = activeFields()
      .map((name) => ({ name, message: validate(name) }))
      .filter((e) => e.message);

    activeFields().forEach((name) => showError(name, errors.find((e) => e.name === name)?.message ?? ''));

    if (errors.length) {
      if (summary && summaryList) {
        summaryList.innerHTML = '';
        errors.forEach(({ name, message }) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          const target = field(name);
          a.href = `#${target?.id ?? ''}`;
          a.textContent = `${labels[name]}: ${message}`;
          a.addEventListener('click', (e) => {
            e.preventDefault();
            target?.focus();
          });
          li.append(a);
          summaryList.append(li);
        });
        summary.hidden = false;
        summary.focus();
      } else {
        field(errors[0].name)?.focus();
      }
      return;
    }

    if (summary) summary.hidden = true;

    const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? '';
    const pref = preference();
    const contact = pref === 'Ligação' ? ` — ${value('telefone')}` : pref === 'E-mail' ? ` — ${value('email')}` : '';

    const lines = [
      'Olá! Gostaria de solicitar um orçamento pelo site da Silbeyer.',
      '',
      `Nome: ${value('nome')}`,
      value('empresa') ? `Empresa: ${value('empresa')}` : '',
      `Tipo de embalagem: ${value('tipo')}`,
      `Necessidade: ${value('descricao')}`,
      `Retorno preferido: ${pref}${contact}`,
    ].filter((line, i) => line !== '' || i === 1);

    const url = whatsappUrl(lines.join('\n'));
    // Sem 'noopener' nos parâmetros: com ele, window.open sempre retorna null.
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;

    if (status) {
      const text = document.createElement('p');
      text.textContent = opened
        ? 'Abrimos o WhatsApp em uma nova aba com a sua mensagem pronta. Revise e toque em enviar.'
        : 'Sua mensagem está pronta. Use o link abaixo para abrir o WhatsApp.';
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = opened ? 'Não abriu? Abrir o WhatsApp novamente' : 'Abrir o WhatsApp com a mensagem';
      status.append(text, link);
    }
  });
}
