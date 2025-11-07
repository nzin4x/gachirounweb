// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://gachiroun.or.kr', // 사이트 URL (배포 후 변경)
  output: 'server', // SSR 활성화
  integrations: [react()],
  adapter: cloudflare(),
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:fs', 'node:os'],
    },
  },
});