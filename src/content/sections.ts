import type { MediaKey } from './media';

/**
 * Conteúdo editorial das seções.
 *
 * VERIFICAR: as categorias de soluções, as etapas do processo e as aplicações
 * são uma proposta de comunicação. Confirme com a Silbeyer quais produtos são
 * fabricados de fato e ajuste os textos antes da publicação. Nenhum texto
 * afirma certificações, tratamentos, prazos, capacidade produtiva ou clientes.
 */

export const hero = {
  eyebrow: 'Embalagens industriais de madeira · Embu-Guaçu, SP',
  titleLines: ['Proteção em madeira.', 'Precisão em cada detalhe.'],
  lead:
    'A Silbeyer fabrica embalagens de madeira sob medida — engradados, caixas e estruturas para indústrias que precisam transportar e armazenar máquinas, equipamentos e cargas com segurança.',
  specs: [
    { label: 'Sob medida', text: 'Dimensões, peso e manuseio da carga orientam cada embalagem.' },
    { label: 'Uso industrial', text: 'Soluções para transporte, armazenagem e movimentação.' },
    { label: 'Contato direto', text: 'Envie as especificações pelo WhatsApp e fale com quem fabrica.' },
  ],
};

export interface Solution {
  code: string;
  title: string;
  summary: string;
  details: string[];
  /** Usado na mensagem do WhatsApp: "orçamento de {subject}". */
  subject: string;
  media?: MediaKey;
}

export const solutionsIntro = {
  index: '01',
  label: 'Soluções',
  title: 'Embalagens de madeira para cada tipo de carga.',
  text:
    'Cada carga tem formato, peso e trajeto próprios. Por isso, a embalagem certa começa pelas especificações do que será protegido — e não por um tamanho padrão.',
};

// VERIFICAR: confirmar a linha de produtos real da Silbeyer.
export const solutions: Solution[] = [
  {
    code: 'SB—01',
    title: 'Engradados de madeira',
    summary:
      'Estruturas abertas, montadas sob medida, que envolvem a carga e mantêm o conjunto leve para o manuseio.',
    details: ['Montagem conforme as dimensões da carga', 'Para peças volumosas e equipamentos'],
    subject: 'engradados de madeira',
    media: 'slattedCrates',
  },
  {
    code: 'SB—02',
    title: 'Caixas de madeira industriais',
    summary:
      'Fechamento em todas as faces para cargas que pedem mais proteção no transporte e na armazenagem.',
    details: ['Embalagem fechada', 'Para peças, componentes e conjuntos industriais'],
    subject: 'caixas de madeira industriais',
    media: 'closedCrates',
  },
  {
    code: 'SB—03',
    title: 'Embalagens para máquinas e equipamentos',
    summary:
      'Base e estrutura definidas a partir do peso, do formato e da forma de movimentação de cada equipamento.',
    details: ['Estrutura definida pelo peso e pelo formato', 'Pensada para a movimentação da carga'],
    subject: 'embalagens de madeira para máquinas e equipamentos',
    media: 'machineCrate',
  },
  {
    code: 'SB—04',
    title: 'Projetos sob medida',
    summary:
      'Para cargas fora do padrão: grandes dimensões, formatos irregulares ou necessidades específicas de proteção.',
    details: ['Medidas definidas a partir da carga', 'Conversa técnica antes da fabricação'],
    subject: 'uma embalagem de madeira sob medida',
  },
];

export const processIntro = {
  index: '02',
  label: 'Processo',
  title: 'Da especificação à embalagem pronta.',
  text:
    'Uma sequência objetiva para chegar à embalagem adequada: entender a carga, definir as medidas, fabricar e preparar para a entrega.',
};

// VERIFICAR: ajustar as etapas ao fluxo de trabalho real da empresa.
export const processSteps = [
  {
    title: 'Entender a aplicação',
    text:
      'Conversamos sobre o que será embalado e como: tipo de carga, dimensões, peso aproximado, forma de transporte e de manuseio.',
    tags: ['Carga', 'Dimensões', 'Peso', 'Transporte'],
  },
  {
    title: 'Definir as especificações',
    text:
      'Com essas informações, definimos o tipo de embalagem, as medidas internas e a estrutura mais adequada para a aplicação.',
    tags: ['Tipo', 'Medidas internas', 'Estrutura'],
  },
  {
    title: 'Fabricar a estrutura',
    text:
      'A embalagem é produzida em madeira de acordo com as especificações combinadas, com atenção a cortes, encaixes e fixações.',
    tags: ['Corte', 'Montagem', 'Fixação'],
  },
  {
    title: 'Preparar para a entrega',
    text:
      'A embalagem é finalizada e preparada para receber a carga e seguir para o transporte, conforme o combinado com o cliente.',
    tags: ['Finalização', 'Identificação', 'Entrega'],
  },
];

export const criteriaIntro = {
  index: '03',
  label: 'Critérios',
  title: 'O que pesa na escolha de uma embalagem industrial.',
  text:
    'Para quem compra embalagens de madeira, os critérios são práticos. São esses os pontos que orientam cada conversa com a Silbeyer.',
};

export const criteria = [
  {
    title: 'Medidas corretas',
    text: 'A embalagem parte das dimensões reais da carga, com folgas adequadas para encaixe, proteção e manuseio.',
  },
  {
    title: 'Proteção no trajeto',
    text: 'Estrutura pensada para os esforços do transporte, da armazenagem e da movimentação.',
  },
  {
    title: 'Precisão na fabricação',
    text: 'Cortes, encaixes e fixações executados conforme as especificações definidas.',
  },
  {
    title: 'Adequação ao uso',
    text: 'O tipo de embalagem é escolhido de acordo com a aplicação, e não a partir de um modelo genérico.',
  },
  {
    title: 'Conversa direta',
    text: 'Orçamento e alinhamento técnico diretamente com o fabricante.',
  },
];

export const applicationsIntro = {
  index: '04',
  label: 'Aplicações',
  title: 'Onde a embalagem de madeira trabalha.',
  text: 'Do chão de fábrica ao destino final, a embalagem acompanha a carga em cada etapa da operação.',
};

export const applications: { code: string; title: string; text: string; media: MediaKey }[] = [
  {
    code: 'A.01',
    title: 'Máquinas e equipamentos',
    text: 'Proteção para equipamentos industriais no deslocamento entre fábrica, fornecedor e cliente.',
    media: 'machinery',
  },
  {
    code: 'A.02',
    title: 'Movimentação e armazenagem',
    text: 'Embalagens que organizam e protegem a carga no estoque e na movimentação interna.',
    media: 'forklift',
  },
  {
    code: 'A.03',
    title: 'Transporte rodoviário',
    text: 'Uma estrutura que ajuda a proteger a carga de impactos e vibrações ao longo do trajeto.',
    media: 'truckLoading',
  },
];

export const galleryIntro = {
  index: '05',
  label: 'Galeria',
  title: 'Da madeira serrada à carga na estrada.',
  text: 'Registros da produção da Silbeyer em Embu-Guaçu: corte, componentes, montagem e expedição.',
};

export const quote = {
  index: '06',
  label: 'Orçamento',
  title: 'Seu projeto começa com as especificações certas.',
  text:
    'Envie as informações da sua carga e fale com a Silbeyer diretamente pelo WhatsApp. Quanto mais completas as especificações, mais objetiva é a conversa.',
  checklistTitle: 'Tenha em mãos, se possível',
  checklist: [
    'Dimensões da carga (comprimento × largura × altura)',
    'Peso aproximado',
    'Tipo de transporte e de manuseio',
    'Quantidade de embalagens',
    'Prazo desejado',
  ],
};

export const packagingOptions = [
  'Engradado de madeira',
  'Caixa de madeira industrial',
  'Embalagem para máquina ou equipamento',
  'Projeto sob medida',
  'Ainda não sei — preciso de orientação',
];
