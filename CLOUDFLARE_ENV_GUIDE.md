# Cloudflare Pages 환경 변수 설정 가이드

## 🎯 개요

이 프로젝트는 **로컬 개발**과 **Cloudflare Pages 배포** 모두에서 작동하도록 설계되었습니다.

## 📋 환경 변수 계층 구조

### 1. 로컬 개발 (npm run dev)
- `.env.local` 파일 사용
- **빌드 타임**: `import.meta.env`로 접근
- **런타임(SSR)**: `Astro.locals.runtime.env` 또는 `import.meta.env` fallback

### 2. Wrangler 로컬 개발 (npm run dev:wrangler)
- `.dev.vars` 파일 사용 (secrets)
- `wrangler.toml` 파일 사용 (public vars)
- Cloudflare 런타임 환경 시뮬레이션
- **빌드 타임**: `import.meta.env`
- **런타임(SSR)**: `Astro.locals.runtime.env`

### 3. Cloudflare Pages 프로덕션
- Cloudflare 대시보드에서 환경 변수 설정
- **빌드 환경 변수** (Settings > Environment variables > Build)
- **Functions 환경 변수** (Settings > Environment variables > Functions) ← **필수!**
- **빌드 타임**: `import.meta.env`로 접근 (빌드 시 주입)
- **런타임(SSR)**: `Astro.locals.runtime.env`로만 접근 가능

## 🔧 로컬 개발 설정

### 방법 1: 기본 Astro 개발 서버 (추천)

1. `.env.local` 파일 생성:
```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN_FULL=your-full-token
STRAPI_API_TOKEN_READ=your-read-token
PUBLIC_GA_ID=GTM-MVL6P7N7
PUBLIC_RECAPTCHA_SITE_KEY=your-key
```

2. 개발 서버 실행:
```bash
npm run dev
```

### 방법 2: Wrangler 개발 서버 (Cloudflare 환경 시뮬레이션)

1. `.dev.vars` 파일 생성 (secrets용):
```env
STRAPI_API_TOKEN_FULL=your-full-token
STRAPI_API_TOKEN_READ=your-read-token
```

2. `wrangler.toml` 확인 (public vars):
```toml
[vars]
STRAPI_URL = "http://localhost:1337"
PUBLIC_GA_ID = "GTM-MVL6P7N7"
PUBLIC_RECAPTCHA_SITE_KEY = "test-key"
```

3. Wrangler 개발 서버 실행:
```bash
npm run dev:wrangler
```

## ☁️ Cloudflare Pages 배포 설정

### 1. 환경 변수 등록

Cloudflare Pages 대시보드 → Settings → Environment variables

#### Build 환경 변수 (빌드 시점)
```
STRAPI_URL = https://faithful-dog-1d263d2e88.strapiapp.com
STRAPI_API_TOKEN_READ = <your-read-only-token>
PUBLIC_GA_ID = GTM-MVL6P7N7
PUBLIC_RECAPTCHA_SITE_KEY = <your-recaptcha-key>
```

#### Functions 환경 변수 (런타임)
**중요**: 위와 동일한 변수를 Functions 섹션에도 등록해야 SSR에서 접근 가능합니다.

```
STRAPI_URL = https://faithful-dog-1d263d2e88.strapiapp.com
STRAPI_API_TOKEN_READ = <your-read-only-token>
PUBLIC_GA_ID = GTM-MVL6P7N7
PUBLIC_RECAPTCHA_SITE_KEY = <your-recaptcha-key>
```

### 2. Secrets 관리 (Wrangler CLI)

민감한 토큰은 Wrangler CLI로 등록:

```bash
# 프로젝트 디렉토리에서 실행
wrangler secret put STRAPI_API_TOKEN_READ --env production

# 토큰 값 입력 프롬프트
Enter the secret text you'd like assigned to the variable STRAPI_API_TOKEN_READ on the script named gachiroun-or-kr:
***************
```

### 3. 배포

```bash
# 빌드 및 배포
npm run deploy

# 또는 Git push로 자동 배포 (연결된 경우)
git push origin main
```

## 🔑 환경 변수 우선순위

### Strapi 토큰
```
STRAPI_API_TOKEN_FULL (최우선)
  ↓ (없으면)
STRAPI_API_TOKEN_READ (권장)
  ↓ (없으면)
STRAPI_API_TOKEN (fallback)
```

### 코드에서 접근 방법

**중요**: Cloudflare Pages Functions(SSR)에서는 `import.meta.env`가 빌드 타임에만 주입됩니다. 런타임에서는 `Astro.locals.runtime.env`를 사용해야 합니다.

```typescript
// src/pages/about.astro 또는 API 엔드포인트에서
---
import strapiClient from '../lib/strapi';

// Cloudflare runtime 환경 변수 접근
const runtime = Astro.locals.runtime;
const env = runtime?.env || import.meta.env;

// env를 strapiClient에 전달
const greeting = await strapiClient.getGreeting(env);
---
```

```typescript
// src/lib/strapi.ts (함수 기반으로 env 매개변수 받음)
function getStrapiConfig(env?: any) {
  const actualEnv = env || import.meta.env;
  const STRAPI_URL = actualEnv.STRAPI_URL || 'http://localhost:1337';
  const STRAPI_TOKEN = actualEnv.STRAPI_API_TOKEN_FULL 
    || actualEnv.STRAPI_API_TOKEN_READ 
    || actualEnv.STRAPI_API_TOKEN 
    || '';
  
  return { STRAPI_URL, STRAPI_TOKEN };
}

export async function getGreeting(env?: any) {
  const { STRAPI_URL, STRAPI_TOKEN } = getStrapiConfig(env);
  // ...
}
```

```typescript
// src/pages/api/greeting.ts (API 엔드포인트)
export const GET: APIRoute = async ({ request, locals }) => {
  const runtime = locals.runtime;
  const env = runtime?.env || import.meta.env;
  
  const greeting = await strapiClient.getGreeting(env);
  // ...
};
```

## 🧪 테스트

### 로컬 테스트
```bash
npm run dev
# http://localhost:4321 접속
# /notice 페이지에서 공지사항 로딩 확인
```

### Cloudflare 환경 시뮬레이션
```bash
npm run dev:wrangler
# Wrangler가 Cloudflare 런타임 환경 시뮬레이션
```

### 프로덕션 미리보기
```bash
npm run build
npm run preview
# Wrangler가 빌드된 dist 폴더를 로컬에서 서빙
```

## ⚠️ 주의사항

1. **절대 커밋하지 말 것**:
   - `.env.local`
   - `.dev.vars`
   - `wrangler.toml.local`

2. **Read-Only 토큰 사용**:
   - 프로덕션에는 `STRAPI_API_TOKEN_READ` 사용 권장
   - `STRAPI_API_TOKEN_FULL`은 로컬 개발용

3. **PUBLIC_ 접두사**:
   - 클라이언트에 노출되는 변수는 반드시 `PUBLIC_` 접두사 사용
   - 예: `PUBLIC_GA_ID`, `PUBLIC_RECAPTCHA_SITE_KEY`

4. **Cloudflare Functions 환경 변수**:
   - SSR 페이지에서 환경 변수를 사용하려면 반드시 **Functions 환경 변수**에도 등록
   - Build 환경 변수만 등록하면 런타임에 `undefined`

## 📚 참고 문서

- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
