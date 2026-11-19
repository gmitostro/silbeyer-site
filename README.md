# Silbeyer Embalagens de Madeira — site institucional

Site de página única para a Silbeyer, fabricante de embalagens industriais de madeira em Embu-Guaçu (SP).
Construído com **Astro 7** (HTML estático), **CSS próprio com tokens** e **GSAP + ScrollTrigger** para a coreografia de rolagem.

> Antes de publicar, leia [VERIFICACAO.md](VERIFICACAO.md): logotipo, fotos e alguns dados ainda precisam ser confirmados pela empresa.

## Como rodar

Requisitos: Node.js 22.23 ou superior.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera /dist (site estático)
npm run preview    # serve o /dist em http://localhost:4321
npm run check      # verificação de tipos (astro check)
```

## Publicação (GitHub Pages)

O site está no ar em **https://gmitostro.github.io/silbeyer-site/** (repositório `gmitostro/silbeyer-site`).
Cada envio (`git push`) para a branch `main` gera e publica o site sozinho, pelo fluxo `.github/workflows/deploy.yml` (aba **Actions** do repositório).
O fluxo informa ao Astro o endereço e a subpasta do Pages (`SITE_URL` e `BASE_PATH`); por isso todo caminho de arquivo em `/public` passa por `asset()` (`src/lib/paths.ts`).

Ficam fora do repositório (ver `.gitignore`): fotos originais em HEIC, downloads do Drive, `assets-originais/` e os estudos de marca em `SILBEYER_BRANDING/`.

O conteúdo de `dist/` também pode ser publicado em qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, servidor próprio).
Quando o domínio for definido, preencha `site` em `astro.config.mjs` — isso ativa a URL canônica, o `og:url` e a URL nos dados estruturados (`LocalBusiness`, em `src/pages/index.astro`).

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Telefone, WhatsApp, endereço, navegação, SEO | `src/content/site.ts` |
| Textos de todas as seções, produtos, etapas, critérios | `src/content/sections.ts` |
| Fotografias e lista da galeria | `src/content/media.ts` |
| Logotipo oficial | `brandLogo` em `src/content/site.ts` + arquivo em `public/brand/` |
| Mensagens pré-preenchidas do WhatsApp | `src/lib/whatsapp.ts` |
| Paleta, tipografia, espaçamento, curvas de movimento | `src/styles/tokens.css` |

### Trocar o logotipo
1. Salve o arquivo aprovado (de preferência SVG) em `public/brand/` — uma versão para fundo escuro e, se houver, outra para fundo claro.
2. Em `src/content/site.ts`, preencha `brandLogo.src`, `brandLogo.srcOnLight`, `width` e `height` com as medidas reais.
3. O componente `Logo.astro` passa a usar o arquivo no cabeçalho, na abertura e no rodapé. A proporção nunca é distorcida (só a altura é definida).
4. Substitua também `public/favicon.svg`, que hoje é um ícone temporário.

### Trocar as fotos
Todas as fotos são reais e ficam em `public/fotos/` (as da galeria em `public/fotos/galeria/`, em 960 e 1600 px, mais uma miniatura `-thumb`). Os originais HEIC estão na pasta `claude/`.
Para trocar uma foto de seção, aponte `local`/`localSrcset` do item em `src/content/media.ts`. Para a galeria, gere os três arquivos com o mesmo nome-base e acrescente um item na lista `gallery` (a ordem da lista é a ordem do carrossel).

## Arquitetura

```
src/
  components/   Header, Intro, Hero, Solutions, Process, Criteria, Applications, Quote, Footer,
                ActionBar (barra de ação no celular), CrateDrawing (desenho isométrico),
                Photo, Logo, Icon, SectionHead
  content/      dados e textos (separados da apresentação)
  layouts/      BaseLayout (metadados, fontes, script que decide a abertura antes da pintura)
  lib/          crate.ts (geometria isométrica), images.ts (srcset), whatsapp.ts
  scripts/      main.ts, intro.ts, navigation.ts, quote-form.ts, motion.ts (carregado sob demanda)
  styles/       tokens.css, global.css
```

- **Zero JS obrigatório para o conteúdo**: todo o texto, imagens e links estão no HTML estático. Sem JavaScript o site continua completo (só não há animações, menu móvel interativo nem montagem automática da mensagem do formulário — há links diretos para WhatsApp e telefone).
- **GSAP** só é baixado depois do carregamento e **nunca** quando o usuário pede movimento reduzido.

## Sistema visual

- **Paleta oficial** (valores exatos): `#E9D8C8`, `#C7A58B`, `#9B735B`, `#69483B`, `#332721`. Os componentes usam apenas tokens semânticos por superfície (`.surface-dark`, `.surface-light`, `.surface-almond`, `.surface-coffee`, `.surface-deep`). Derivados existem só para profundidade, campos de formulário, erro e sombreamento das peças de madeira no desenho.
- **Contraste**: textos pequenos só em pares ≥ 4,5:1 (carvão/bege 10,4:1; amêndoa/carvão 6,3:1; bege/café 5,8:1). O cobre (`#9B735B`) é usado apenas em gráficos e elementos grandes.
- **Tipografia** (arquivos locais via Fontsource): Archivo variável com eixo de largura — condensada para títulos (estética de marcação de carga), largura normal para texto — e IBM Plex Mono para rótulos técnicos, cotas e códigos.
- **Linguagem gráfica**: réguas, cotas, marcas de corte e o “carimbo” de desenho técnico no rodapé.

## Movimento

| Peça | Técnica | Observação |
| --- | --- | --- |
| Abertura “Da matéria à proteção” (~3 s) | CSS puro + SVG (`feTurbulence` para o veio da madeira) | 1ª visita da sessão; pulável; qualquer rolagem/tecla encerra; nunca passa de ~4 s; com movimento reduzido vira um quadro estático breve |
| Régua das seções | GSAP | a linha de medida se desenha ao entrar |
| Desenho técnico do processo | GSAP ScrollTrigger (scrub) | a embalagem é construída etapa a etapa; no celular toca uma vez |
| Composição em camadas (Critérios) | GSAP (scrub) | as “tábuas” se afastam e revelam a estrutura |
| Revelação de fotos | GSAP (clip-path) | direção ligada à composição |
| Galeria — montagem por ripas | Web Animations API | a foto seguinte entra em três ripas (as da logo), uma após a outra; régua mede a posição; setas, miniaturas, teclado e arrastar; com movimento reduzido a troca é imediata |
| Microinterações | CSS | sublinhado que se desenha, seta que avança, marcas de corte no hover |

Não há rolagem horizontal sequestrada nem *pinning* forçado: o desenho do processo usa `position: sticky` apenas no desktop.

### Revisar animações com “reduzir movimento” ativo
Somente em `npm run dev`, abra `http://localhost:4321/?qa-motion` para forçar o modo com movimento (útil quando o sistema operacional está com animações desativadas). Para rever a abertura, limpe o `sessionStorage` (chave `sb-intro`). Esse gancho não existe no build de produção.

## Formulário de orçamento
Não há servidor. O formulário valida os campos e **abre o WhatsApp com a mensagem pronta**, para o cliente revisar e enviar. Nenhum dado é enviado ou armazenado pelo site — o texto da página diz isso explicitamente. Se no futuro houver um backend ou serviço de formulários, a integração entra em `src/scripts/quote-form.ts`.
