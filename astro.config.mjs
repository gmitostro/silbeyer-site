// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // No GitHub Pages, o fluxo .github/workflows/deploy.yml informa o endereço
  // (SITE_URL) e a subpasta do repositório (BASE_PATH). Localmente o site fica na raiz.
  // Com domínio próprio: SITE_URL = domínio e BASE_PATH vazio.
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'always',
  },
});
