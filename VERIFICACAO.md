# Itens a confirmar antes da publicação

Nada abaixo foi inventado no site. Os itens marcados já foram confirmados; os demais dependem da Silbeyer.

## Identidade e ativos (a empresa ainda vai escolher)
- [ ] **Logotipo oficial** — o site usa uma composição tipográfica temporária ("SILBEYER / Embalagens de Madeira"), que **não** é o logotipo. Ver README → "Trocar o logotipo".
- [ ] **Favicon** — `public/favicon.svg` é um ícone neutro temporário; trocar junto com o logotipo.
- [x] **Fotografias** — todas são fotos reais da Silbeyer (nenhuma imagem da internet). Registro em `src/content/media.ts`.
- [x] **Marca de cliente** — a foto das caixas na Solução 02 (IMG_3660) mostra a marca de um cliente; publicação autorizada pela empresa. IMG_5472 e IMG_5473 (marca "Global") seguem fora do site.
- [ ] **Imagem de compartilhamento (og:image)** — omitida até haver domínio e uma imagem aprovada (de preferência com o logotipo oficial).

## Contato
- [x] **CEP** — 06902-245, informado pela empresa. Conferido na base dos Correios (ViaCEP): Rua Leonardo Scacciotti Neto, bairro Flórida, Embu-Guaçu/SP.
- [x] **Grafia da rua** — corrigida para "Scacciotti" (dois "c"), como consta nos Correios. O briefing trazia "Scaciotti".
- [ ] **Número 150** — vem do briefing original. Confirmar com a empresa (e informar complemento, se houver).
- [x] **WhatsApp** — usa o mesmo número do telefone, (11) 4661-3691 (`wa.me/551146613691`), confirmado pela empresa.
- [ ] E-mail, horário de atendimento, redes sociais e CNPJ **não** foram incluídos por não terem sido informados.

## Conteúdo (proposta de comunicação)
- [ ] **Linhas de solução** — Engradados de madeira; Caixas de madeira industriais; Embalagens para máquinas e equipamentos; Projetos sob medida. Confirmar se correspondem à linha de produtos real (`src/content/sections.ts`).
- [ ] **Etapas do processo** — entender a aplicação → definir especificações → fabricar → preparar para a entrega. Ajustar ao fluxo real.
- [ ] **Aplicações** — máquinas e equipamentos, movimentação e armazenagem, transporte rodoviário.
- [ ] O site **não** afirma certificações, tratamento fitossanitário (ex.: ISPM 15/NIMF 15), exportação, prazos, capacidade produtiva, anos de mercado ou clientes. Se algum desses pontos for real e comprovável, ele pode ser acrescentado.
- [ ] As cotas do desenho da abertura (1200 / 800 / 950) são ilustrativas.

## Técnico
- [x] **Dados estruturados** (`LocalBusiness`) — incluídos em `src/pages/index.astro` só com nome, descrição, telefone e endereço. Logotipo, imagem, horário e redes sociais ficam de fora até serem informados.
- [ ] Definir o domínio e preencher `site` em `astro.config.mjs` (ativa URL canônica, `og:url` e o campo `url` dos dados estruturados).
