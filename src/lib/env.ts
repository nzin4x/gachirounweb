/**
 * 환경 변수 헬퍼
 * 로컬 개발(import.meta.env)과 Cloudflare Pages(context.env) 모두 지원
 */

interface Env {
  STRAPI_URL?: string;
  STRAPI_API_TOKEN?: string;
  STRAPI_API_TOKEN_FULL?: string;
  STRAPI_API_TOKEN_READ?: string;
  PUBLIC_GA_ID?: string;
  PUBLIC_RECAPTCHA_SITE_KEY?: string;
}

/**
 * Astro.locals에서 Cloudflare 런타임 환경 변수 가져오기
 * SSR 컨텍스트에서만 사용 가능
 */
export function getEnv(locals?: any): Env {
  // Cloudflare Pages Functions에서 runtime 환경 변수 접근
  const runtime = locals?.runtime;
  
  if (runtime?.env) {
    // Cloudflare 런타임 환경
    return {
      STRAPI_URL: runtime.env.STRAPI_URL,
      STRAPI_API_TOKEN: runtime.env.STRAPI_API_TOKEN,
      STRAPI_API_TOKEN_FULL: runtime.env.STRAPI_API_TOKEN_FULL,
      STRAPI_API_TOKEN_READ: runtime.env.STRAPI_API_TOKEN_READ,
      PUBLIC_GA_ID: runtime.env.PUBLIC_GA_ID,
      PUBLIC_RECAPTCHA_SITE_KEY: runtime.env.PUBLIC_RECAPTCHA_SITE_KEY,
    };
  }
  
  // 로컬 개발 환경 (import.meta.env fallback)
  return {
    STRAPI_URL: import.meta.env.STRAPI_URL,
    STRAPI_API_TOKEN: import.meta.env.STRAPI_API_TOKEN,
    STRAPI_API_TOKEN_FULL: import.meta.env.STRAPI_API_TOKEN_FULL,
    STRAPI_API_TOKEN_READ: import.meta.env.STRAPI_API_TOKEN_READ,
    PUBLIC_GA_ID: import.meta.env.PUBLIC_GA_ID,
    PUBLIC_RECAPTCHA_SITE_KEY: import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY,
  };
}

/**
 * Strapi 토큰 가져오기 (우선순위: FULL > READ > 기본)
 */
export function getStrapiToken(env: Env): string {
  return env.STRAPI_API_TOKEN_FULL 
    || env.STRAPI_API_TOKEN_READ 
    || env.STRAPI_API_TOKEN 
    || '';
}

/**
 * Strapi URL 가져오기
 */
export function getStrapiUrl(env: Env): string {
  return env.STRAPI_URL || 'http://localhost:1337';
}
