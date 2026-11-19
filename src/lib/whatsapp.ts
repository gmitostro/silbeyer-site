import { company } from '../content/site';

export const defaultQuoteMessage =
  'Olá! Conheci a Silbeyer pelo site e gostaria de solicitar um orçamento para embalagens de madeira. Poderiam me orientar sobre as informações necessárias?';

export function whatsappUrl(message: string = defaultQuoteMessage): string {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Mensagem pré-preenchida para um tipo específico de embalagem. */
export function quoteMessageFor(subject: string): string {
  return `Olá! Conheci a Silbeyer pelo site e gostaria de solicitar um orçamento de ${subject}. Poderiam me orientar sobre as informações necessárias?`;
}
