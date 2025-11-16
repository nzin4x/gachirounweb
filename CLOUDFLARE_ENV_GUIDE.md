# Cloudflare Pages 환경 변수 설정 가이드

## 🎯 개요

이 프로젝트는 **로컬 개발**과 **Cloudflare Pages 배포** 모두에서 작동하도록 설계되었습니다.

**중요**: Cloudflare Pages는 `wrangler.toml`이 있으면 환경 변수를 소스 코드에서 관리합니다.
- **비민감 정보**(STRAPI_URL, PUBLIC_GA_ID 등): `wrangler.toml` [vars] 섹션
- **민감 정보**(API 토큰): Cloudflare Secrets (대시보드 또는 wrangler CLI)

## 📋 환경 변수 계층 구조

### 우선순위: wrangler.toml > .dev.vars > .env.local

### 1. wrangler.toml (비민감 정보, Git 커밋)
- `[vars]`: 로컬 개발용 환경 변수
- `[env.production.vars]`: 프로덕션 배포용 환경 변수
- **포함 항목**: STRAPI_URL, PUBLIC_GA_ID, PUBLIC_RECAPTCHA_SITE_KEY
- Cloudflare Pages가 자동으로 읽어서 빌드 및 런타임에 주입

### 2. .dev.vars (민감 정보, Git 무시)
- **로컬 개발 전용** Secrets 파일
- **포함 항목**: STRAPI_API_TOKEN_READ
- `npm run dev:wrangler` 실행 시 자동 로딩

### 3. Cloudflare Secrets (프로덕션)
- **Cloudflare 대시보드** → Settings → Variables and Secrets → Add Secret
- 또는 **wrangler CLI**: `wrangler secret put STRAPI_API_TOKEN_READ`
- **포함 항목**: STRAPI_API_TOKEN_READ (암호화 저장)

### 4. 런타임 접근 방식
- **빌드 타임**: `import.meta.env` (wrangler.toml [vars]에서 주입)
- **런타임(SSR)**: `Astro.locals.runtime.env` (wrangler.toml + Secrets 병합)

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

### 1. wrangler.toml 설정 (이미 완료)

프로덕션 환경 변수는 `wrangler.toml`에 정의되어 있습니다:

```toml
[env.production.vars]
STRAPI_URL = "https://faithful-dog-1d263d2e88.strapiapp.com"
PUBLIC_GA_ID = "GTM-MVL6P7N7"
PUBLIC_RECAPTCHA_SITE_KEY = "your-key"
```

**Git에 커밋되므로 민감 정보는 절대 포함하지 마세요!**

### 2. Cloudflare Secret 등록 (필수)

민감한 토큰은 Cloudflare Secret으로 등록:

#### 방법 1: Wrangler CLI (추천)
```bash
cd c:\lsrc\gachiroun\homepage
npx wrangler secret put STRAPI_API_TOKEN_READ

# 프롬프트에서 토큰 값 붙여넣기:
Enter a secret value: ***************
```

#### 방법 2: Cloudflare 대시보드
1. Cloudflare Pages → 프로젝트 선택
2. Settings → Variables and Secrets
3. "Add" → "Secret" 선택
4. Name: `STRAPI_API_TOKEN_READ`, Value: 토큰 붙여넣기
5. Deploy production 선택

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

1. **Git 커밋 규칙**:
   - ✅ **커밋해야 함**: `wrangler.toml` (비민감 정보만)
   - ❌ **절대 커밋 금지**: `.env.local`, `.dev.vars`

2. **wrangler.toml 관리**:
   - `[vars]`: 비민감 정보만 (URL, public API key)
   - 토큰, password 등은 절대 포함 금지 → Secrets 사용

3. **Cloudflare Secrets**:
   - 프로덕션 토큰은 반드시 Cloudflare Secret으로 등록
   - wrangler.toml이 있으면 대시보드 환경 변수 설정이 무시됨
   - Secret만 대시보드에서 관리 가능

4. **Read-Only 토큰 사용**:
   - 프로덕션: `STRAPI_API_TOKEN_READ` (읽기 전용)
   - 로컬 개발: `STRAPI_API_TOKEN_FULL` (편의상)

5. **PUBLIC_ 접두사**:
   - 클라이언트 노출 변수는 `PUBLIC_` 필수
   - 예: `PUBLIC_GA_ID`, `PUBLIC_RECAPTCHA_SITE_KEY`

## 📚 참고 문서

- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
