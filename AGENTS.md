# AI Agent Development Guide

> AI 에이전트가 이 프로젝트를 이해하고 작업하기 위한 상세 가이드

## 📋 프로젝트 컨텍스트

### 프로젝트 유형
- **카테고리**: 사회복지 단체 홈페이지 (소개형 웹사이트)
- **목적**: 사회적협동조합 가치로운(gachiroun.or.kr)의 활동 소개 및 홍보
- **주요 사용자**: 일반 대중, 활동지원사 구직자, 서비스 이용자

### 핵심 요구사항
1. **SSR (Server-Side Rendering)**: SEO 최적화를 위한 필수 요구사항
2. **반응형 디자인**: PC와 모바일 모두 지원
3. **동적 컨텐츠**: Strapi CMS를 통한 컨텐츠 관리
4. **폼 관리**: 활동지원사 구직신청 (Google Forms 또는 Strapi)
5. **Analytics**: Google Analytics 4 통합

## 🏗 아키텍처 설계

### 기술 스택 선택 이유

#### Astro
- **선택 이유**: 
  - SSR 기본 지원
  - 성능 최적화 (부분 하이드레이션)
  - SEO 친화적
  - React 등 다양한 프레임워크 통합 가능
- **사용 패턴**: 
  - 정적 페이지는 `.astro` 파일로 작성
  - 인터랙티브 컴포넌트는 React로 작성하고 `client:*` 디렉티브 사용

#### React
- **선택 이유**:
  - 슬라이딩 배너, 팝업 등 인터랙티브 컴포넌트 개발
  - 풍부한 생태계 및 라이브러리
- **사용 패턴**:
  - 클라이언트 사이드 인터랙션이 필요한 컴포넌트만 React로 작성
  - `client:load`, `client:visible` 등으로 최적화

#### Strapi
- **선택 이유**:
  - Headless CMS로 컨텐츠와 프론트엔드 분리
  - REST API 및 GraphQL 지원
  - 관리자 패널 제공
- **사용 패턴**:
  - 공지사항, 팝업, 페이지 본문 등 관리
  - 빌드 타임 또는 런타임에 API 호출

### 디렉토리 구조

```
homepage/
├── src/
│   ├── pages/              # Astro 페이지 (파일 기반 라우팅)
│   │   ├── index.astro     # 메인 페이지
│   │   ├── about/
│   │   │   ├── index.astro
│   │   │   ├── history.astro
│   │   │   ├── organization.astro
│   │   │   └── location.astro
│   │   ├── services/
│   │   │   ├── index.astro
│   │   │   ├── elderly.astro
│   │   │   ├── disability.astro
│   │   │   └── youth.astro
│   │   ├── notice/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   └── recruit.astro
│   ├── components/         # 컴포넌트
│   │   ├── astro/          # Astro 컴포넌트
│   │   │   ├── Layout.astro
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── SEO.astro
│   │   └── react/          # React 컴포넌트
│   │       ├── Slider.tsx
│   │       ├── Popup.tsx
│   │       └── RecaptchaForm.tsx
│   ├── layouts/            # 레이아웃
│   │   ├── MainLayout.astro
│   │   └── PageLayout.astro
│   ├── lib/                # 유틸리티 및 API 클라이언트
│   │   ├── strapi.ts       # Strapi API 클라이언트
│   │   ├── analytics.ts    # GA4 헬퍼
│   │   └── utils.ts
│   ├── styles/             # 스타일
│   │   ├── global.css
│   │   ├── theme.css       # 색상, 폰트 등
│   │   └── fonts.css       # 아리따돋움 웹폰트
│   └── types/              # TypeScript 타입
│       └── strapi.d.ts
├── public/                 # 정적 파일
│   ├── images/
│   ├── fonts/
│   └── robots.txt
├── astro.config.mjs        # Astro 설정
├── tsconfig.json           # TypeScript 설정
├── package.json
├── .env.example
└── README.md
```

## 🎨 디자인 시스템

### 색상 팔레트

```css
:root {
  /* Primary - 분홍/자몽색 */
  --color-primary-50: #fff1f2;
  --color-primary-100: #ffe4e6;
  --color-primary-200: #fecdd3;
  --color-primary-300: #fda4af;
  --color-primary-400: #fb7185;
  --color-primary-500: #f43f5e;  /* 메인 */
  --color-primary-600: #e11d48;
  --color-primary-700: #be123c;
  
  /* Secondary - 초록색 */
  --color-secondary-50: #f0fdf4;
  --color-secondary-100: #dcfce7;
  --color-secondary-200: #bbf7d0;
  --color-secondary-300: #86efac;
  --color-secondary-400: #4ade80;
  --color-secondary-500: #22c55e;  /* 메인 */
  --color-secondary-600: #16a34a;
  --color-secondary-700: #15803d;
  
  /* Neutral */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
}
```

### 타이포그래피

```css
/* 아리따돋움 웹폰트 */
@font-face {
  font-family: 'Arita-dotum';
  src: url('/fonts/Arita-dotum-Medium.woff2') format('woff2'),
       url('/fonts/Arita-dotum-Medium.woff') format('woff');
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Arita-dotum';
  src: url('/fonts/Arita-dotum-Bold.woff2') format('woff2'),
       url('/fonts/Arita-dotum-Bold.woff') format('woff');
  font-weight: 700;
  font-display: swap;
}

body {
  font-family: 'Arita-dotum', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 반응형 브레이크포인트

```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
}
```

## 🔌 Strapi 연동 패턴

### API 클라이언트 구조

```typescript
// src/lib/strapi.ts
interface StrapiConfig {
  url: string;
  token?: string;
}

class StrapiClient {
  private baseURL: string;
  private token?: string;

  constructor(config: StrapiConfig) {
    this.baseURL = config.url;
    this.token = config.token;
  }

  async get(endpoint: string, params?: Record<string, any>) {
    // GET 요청 구현
  }

  async post(endpoint: string, data: any) {
    // POST 요청 구현
  }

  // 특정 컨텐츠 타입별 메서드
  async getNotices(params?: { page?: number; pageSize?: number }) {
    return this.get('/notices', params);
  }

  async getNoticeById(id: string) {
    return this.get(`/notices/${id}`);
  }

  async getPopups() {
    return this.get('/popups', { 
      filters: { active: true } 
    });
  }

  async getPageContent(pageId: string) {
    return this.get('/page-contents', {
      filters: { pageId }
    });
  }
}

export const strapi = new StrapiClient({
  url: import.meta.env.STRAPI_URL,
  token: import.meta.env.STRAPI_API_TOKEN,
});
```

### 사용 예시

```astro
---
// src/pages/notice/index.astro
import { strapi } from '@/lib/strapi';

const notices = await strapi.getNotices({ page: 1, pageSize: 10 });
---

<div class="notices">
  {notices.data.map(notice => (
    <article>
      <h2>{notice.title}</h2>
      <p>{notice.excerpt}</p>
    </article>
  ))}
</div>
```

## 📊 Google Analytics 연동

### 구현 패턴

```typescript
// src/lib/analytics.ts
export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_ID;

export function trackPageView(url: string) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
}
```

## 🎯 SEO 최적화 체크리스트

### 각 페이지에 구현해야 할 사항

1. **메타 태그**
   - `<title>`: 명확하고 고유한 제목
   - `<meta name="description">`: 페이지 설명 (150-160자)
   - Open Graph 태그 (소셜 미디어 공유)
   - Twitter Card 태그

2. **구조화된 데이터**
   - Schema.org Organization
   - Schema.org WebSite
   - Schema.org BreadcrumbList

3. **이미지 최적화**
   - `alt` 속성 필수
   - WebP 포맷 사용
   - Lazy loading

4. **URL 구조**
   - 짧고 명확한 URL
   - 한글 피하기 (영문 slug 사용)
   - 계층 구조 명확히

## 🔒 보안 고려사항

### reCAPTCHA 구현

```typescript
// src/components/react/RecaptchaForm.tsx
import { useState } from 'react';

export function RecaptchaForm() {
  const [captchaToken, setCaptchaToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      alert('reCAPTCHA를 완료해주세요.');
      return;
    }

    // 서버로 전송
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        captchaToken,
        // 폼 데이터
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
      <div className="g-recaptcha" 
           data-sitekey={import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY}
           data-callback={setCaptchaToken}>
      </div>
      <button type="submit">제출</button>
    </form>
  );
}
```

## 🚀 배포 프로세스

### Cloudflare Pages 설정

1. **astro.config.mjs에 어댑터 추가**
```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server', // SSR 활성화
  adapter: cloudflare(),
});
```

2. **빌드 명령**
```bash
npm run build
```

3. **Cloudflare Pages 설정**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18.x

## 🧪 개발 시 주의사항

### AI Agent가 작업할 때 따라야 할 원칙

1. **SSR 우선**: 가능한 모든 페이지를 SSR로 구현
2. **성능 최적화**: 
   - 클라이언트 JavaScript 최소화
   - 이미지 최적화
   - 폰트 로딩 최적화
3. **접근성**: WCAG 2.1 AA 레벨 준수
4. **반응형**: 모바일 우선 접근
5. **SEO**: 모든 페이지에 적절한 메타 태그
6. **타입 안정성**: TypeScript 엄격 모드 사용

### 코드 작성 패턴

```astro
---
// ✅ 좋은 예: SSR로 데이터 페칭
import Layout from '@/layouts/MainLayout.astro';
import { strapi } from '@/lib/strapi';

const pageContent = await strapi.getPageContent('about');
---

<Layout title="소개" description="가치로운 사회적협동조합 소개">
  <div class="content" set:html={pageContent.html} />
</Layout>

<style>
  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }
  }
</style>
```

## 📝 컨텐츠 관리 전략

### 동적 컨텐츠 교체 시스템

각 페이지는 고정된 레이아웃을 가지지만, 본문 컨텐츠는 Strapi에서 가져옵니다:

```astro
---
// 페이지 ID로 컨텐츠 매핑
const PAGE_ID = 'about-history';
const content = await strapi.getPageContent(PAGE_ID);
---

<section class="page-section">
  <div class="container">
    <!-- Strapi에서 가져온 동적 컨텐츠 -->
    <div class="dynamic-content" set:html={content.body} />
  </div>
</section>
```

## 🎯 현재 단계 목표

**오늘의 목표**: https://gachirounweb.pages.dev/ 수준의 SSR 페이지를 Cloudflare에 배포

### 체크리스트
- [ ] Astro 프로젝트 초기 설정
- [ ] 기본 레이아웃 구현
- [ ] 메인 페이지 구현 (슬라이더 포함)
- [ ] 주요 페이지 구조 생성
- [ ] Cloudflare 어댑터 설정
- [ ] 빌드 및 배포

---

**Last Updated**: 2025-11-07
**AI Agent**: 이 문서를 기반으로 프로젝트를 이해하고 작업을 수행하세요.
