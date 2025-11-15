# 환경 변수 가이드

## Astro env API 사용

이 프로젝트는 Astro의 `env` schema를 사용하여 타입 안전한 환경 변수 관리를 구현합니다.

### 환경 변수 선언 위치

`astro.config.mjs`의 `env.schema`에 모든 환경 변수를 선언합니다:

```javascript
const envSchema = /** @type {const} */ ({
  STRAPI_URL: {
    type: 'string',
    context: 'server',
    access: 'secret',
  },
  STRAPI_API_TOKEN: {
    type: 'string',
    context: 'server',
    access: 'secret',
  },
  PUBLIC_GA_ID: {
    type: 'string',
    context: 'client',
    access: 'public',
  },
  PUBLIC_RECAPTCHA_SITE_KEY: {
    type: 'string',
    context: 'client',
    access: 'public',
  },
});
```

### 환경 변수 사용 방법

#### 서버 사이드 (Astro 컴포넌트, API 라우트)

```typescript
import { STRAPI_URL, STRAPI_API_TOKEN } from 'astro:env/server';

// 사용 예시
const data = await fetch(`${STRAPI_URL}/api/notices`, {
  headers: {
    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  },
});
```

#### 클라이언트 사이드 (React 컴포넌트 등)

```typescript
import { PUBLIC_GA_ID, PUBLIC_RECAPTCHA_SITE_KEY } from 'astro:env/client';

// 사용 예시
console.log('GA ID:', PUBLIC_GA_ID);
```

### Cloudflare Pages 배포 시 설정

#### 1. 환경 변수 등록

Cloudflare Pages 대시보드에서 **Settings > Environment variables**:

**빌드 환경 변수 (Build)**:
- `STRAPI_URL`: Strapi 서버 URL (예: `https://faithful-dog-1d263d2e88.strapiapp.com`)
- `STRAPI_API_TOKEN`: Strapi Read-only API 토큰
- `PUBLIC_GA_ID`: Google Analytics ID
- `PUBLIC_RECAPTCHA_SITE_KEY`: reCAPTCHA Site Key

**런타임 환경 변수 (Functions)**:
- 위와 동일한 변수들을 Functions 섹션에도 등록

#### 2. Secret 관리 (Wrangler CLI 사용)

민감한 토큰은 Wrangler CLI로 등록:

```bash
wrangler secret put STRAPI_API_TOKEN
# 토큰 값 입력
```

### 로컬 개발 환경 설정

`.env.local` 파일 생성 (`.gitignore`에 포함됨):

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-read-only-token-here
PUBLIC_GA_ID=your-ga-id
PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-key
```

### 보안 모범 사례

1. **Read-only 토큰 사용**: `STRAPI_API_TOKEN`은 반드시 읽기 전용 토큰 사용
2. **Secret 분리**: 민감한 값은 절대 클라이언트에 노출하지 않음
3. **서버 프록시**: 클라이언트에서 Strapi 호출 시 `/api/*` 서버 엔드포인트를 통해 프록시
4. **PUBLIC_ 접두사**: 클라이언트에 노출되는 변수는 반드시 `PUBLIC_` 접두사 사용

### 마이그레이션 완료

- ✅ `import.meta.env` → `astro:env/server` / `astro:env/client` 전환 완료
- ✅ `astro.config.mjs`에 env schema 선언 완료
- ✅ 모든 서버/클라이언트 코드에서 타입 안전한 환경 변수 접근 구현
- ✅ Cloudflare Pages 배포 가이드 문서화

### 참고 문서

- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
