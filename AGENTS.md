# AI Agent Development Guide

> AI 에이전트가 이 프로젝트를 이해하고 작업하기 위한 상세 가이드

## 📝 문서 유지관리 정책

**중요: 주요 개선 또는 아키텍처 변경 사항은 반드시 이 문서(AGENTS.md)에 기록해야 합니다.**

### 업데이트가 필요한 경우
- 새로운 기능 추가 (명령 팔레트, API 엔드포인트, 관리자 도구 등)
- 아키텍처 변경 (디렉토리 구조, 라이브러리 추가, 빌드 프로세스 변경)
- 디자인 시스템 변경 (색상, 폰트, 테마, 컴포넌트 패턴)
- 보안 정책 변경 (토큰 관리, API 보안, 인증 방식)
- 개발 워크플로우 변경 (환경 변수, 배포 절차, 테스트 방법)
- 데이터 페칭 전략 변경 (SSR/SSG, GraphQL/REST, 캐싱 정책)

### 문서화 원칙
1. **명확성**: 다른 AI 에이전트가 읽고 즉시 이해할 수 있도록 작성
2. **구체성**: 추상적 설명보다 코드 예시와 파일 경로 제공
3. **최신성**: 변경 즉시 반영 (커밋 전 필수)
4. **완전성**: 새로운 개발자/에이전트가 이 문서만으로 프로젝트 파악 가능해야 함

### 업데이트 절차
```markdown
1. 해당 섹션을 찾거나 새 섹션 생성
2. 변경 내용을 명확하게 기술 (코드 예시 포함)
3. "Last Updated" 날짜 갱신
4. "Recent Changes"에 요약 추가
5. 관련 파일 경로와 사용법 명시
```

---

## 🔒 보안 고려사항
**Production** (`https://faithful-dog-1d263d2e88.strapiapp.com`)
- Full: `f67c28ce21e065b51db8c80231de80e3d7909bfe971a5a69119df290dacdc13e828bcd6f5f24e2ebdd7c3200b33152339b34cdd8ef5eda0be0188b16a7c8c414a913d77158db22d6ef8c28bf822cf17cbb88a6ec309c217ae4160fe052ff179e58ceb05f21f35e04c9b4e5e479224e9bc547486aafa2a08a03f2ef038d2e480f`
- Read: `cffc222adc5ca64ae04d7ce3e196733731250e15741ef89ebd7f738a290876007e93ddbc082323c505571bb811f2c28e80afe3e9d82c01aee5e216e2dfd10ea93646ce439ab19fd89e10cc060407b4374f5fb27fce7e90ee51dcf98ba310494a0ece89d094fe824c58191a6d383c98f65c22cf6e53916c7217a88351fb971f5e`

**Local** (`http://localhost:1337`)
- Full: `79a9d5d5b9d0bdb1e6f8ab434e478ce2048606bd0a67b800a129a63fc7de1dd6e5b7a434338ff317ace397fe519b63aaad9747252ec332a1b6d4a7892b1318f2f57ecfd1be935c159a21ac70834d5faffbe570d698dc90d25ed476a31c26903acb261e9b7089dc2d84dad22704aea1cbddb8a8fea4703b79be43c615002f0900`
- Read: `2a8c4b98326f43e2858c5f3c56687da6599c734727279df45a41d24ec8b265ba534545c7a9b58cb2d3e669b410c0925998c515c51b6c671516a2c7f5c8b35327e6b69861a4352f152d93e59161b7339c1bce0ec1f4223407e5d8af4f342d85ac11e4d438589b9f555367da60182c2c9fe8ef182f682895e1908baaa491520817`

### GraphQL 운영 지침

- **Introspection On**: GraphQL Playground에서 스키마 탐색 가능.
- **로컬 우선 개발**: `graphql` endpoint는 `http://localhost:1337/graphql`.
- **프로덕션 배포**: Cloudflare Pages SSR에서 fetch 시 production endpoint 사용.
- **스키마 확장 가이드**: 필요한 타입이 없으면 아래 템플릿을 Strapi 개발자에게 전달.

```graphql
# 예) 공지사항 리스트 타입 추가 요청
type Notice {
  id: ID!
  title: String!
  slug: String!
  publishedAt: DateTime!
  summary: String
  body: JSON
}

type Query {
  notices(limit: Int = 10, sort: String = "publishedAt:desc"): [Notice!]!
}

# Mutation 예시 (필요 시)
input NoticeInput {
  title: String!
  summary: String
  body: JSON
  publishedAt: DateTime
}

type Mutation {
  createNotice(data: NoticeInput!): Notice!
}
```

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
│   │       ├── ThemeSwitcher.tsx
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

### 테마 시스템

**2가지 전문적인 테마 제공**:

1. **프로페셔널 블루 (Trust Blue)** - 기본 테마
   - 신뢰와 안정을 상징하는 전문적인 테마
   - Noto Sans KR 폰트 사용
   - 남색(#1e40af) + 파랑(#0ea5e9) 조합

2. **가치로운 오리지널 (Gachiroun Original)** - 대체 테마
   - 따뜻하면서도 전문적인 소셜 케어 브랜드
   - Arita-dotum 폰트 사용
   - 코랄 오렌지(#f26538) + 앰버 골드(#f59e0b) 조합

### 색상 팔레트 (가치로운 오리지널)

```css
:root {
  /* Primary - 코랄 오렌지 (따뜻함, 전문성, 신뢰) */
  --color-primary-50: #fff5f1;
  --color-primary-100: #ffe8de;
  --color-primary-200: #ffd4c3;
  --color-primary-300: #ffb599;
  --color-primary-400: #ff8961;
  --color-primary-500: #f26538;  /* 메인 코랄 오렌지 - 차분하고 세련된 */
  --color-primary-600: #e04d1f;
  --color-primary-700: #b93d18;
  
  /* Accent - 앰버 골드 (희망, 따뜻함, 신뢰) */
  --color-accent-50: #fffbeb;
  --color-accent-100: #fef3c7;
  --color-accent-200: #fde68a;
  --color-accent-300: #fcd34d;
  --color-accent-400: #fbbf24;
  --color-accent-500: #f59e0b;  /* 메인 앰버 골드 - 차분하고 고급스러운 */
  --color-accent-600: #d97706;
  --color-accent-700: #b45309;
  
  /* Secondary - 테라코타 (안정, 지속가능성) */
  --color-secondary-50: #fdf4f3;
  --color-secondary-100: #fbe8e6;
  --color-secondary-200: #f8d5d1;
  --color-secondary-300: #f2b6ad;
  --color-secondary-400: #e88c7d;
  --color-secondary-500: #d96c54;  /* 차분한 테라코타 */
  --color-secondary-600: #c65338;
  --color-secondary-700: #a6402b;
  
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

### 브랜드 의미

**가치로운의 조성**: '가'(값) + '치'(값)
- **코랄 오렌지**: 열정과 따뜻함, 전문성과 신뢰를 나타냄
- **앰버 골드**: 희망과 따뜻함, 품격있는 전문성을 상징
- **테라코타**: 안정성, 지속가능성, 신뢰를 의미 (보조색상)

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

### 섹션별 API 주석 규칙

- 모든 Astro/React 섹션 컴포넌트 상단에 `// Strapi API: <엔드포인트>` 주석을 추가한다.
  - 예) `// Strapi API: /api/home-hero?populate=slides`.
- 다중 데이터를 fetch할 경우, 주석에 배열로 명시한다.
  - 예) `// Strapi API: [/api/notices, /api/events]`.
- 명령 팔레트 액션 "API 경로 표시" 실행 시, 현재 파일의 주석을 읽어 UI에 오버레이한다 (구현 예정).
- 주석 변경 시 `AGENTS.md`와 `src/lib/strapi.ts` 타입 정의도 함께 업데이트한다.

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

<Layout title="소개" description="사회적협동조합 가치로운 소개">
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

**최신 목표**: PDF 기반 상세 컨텐츠로 전면 개편 완료

### 완료 체크리스트
- [x] Astro 프로젝트 초기 설정
- [x] 기본 레이아웃 구현 (Header, Footer, SEO)
- [x] 메인 페이지 구현 (슬라이더, 비전, 사업소개, 통계)
- [x] 주요 페이지 구조 생성
- [x] Cloudflare 어댑터 설정
- [x] 테마 색상 변경 (주황 #FF6B35, 노랑 #FFB800)
- [x] About 페이지 상세화 (미션/비전/가치 6가지/특장점 6가지)
- [x] 재가방문요양사업 페이지 (서비스/등급/절차 상세)
- [x] 장애인활동지원 페이지 (서비스/본인부담금/교육)
- [x] 아동청소년지원 페이지 (4개 프로그램 카테고리)
- [x] 조직 페이지 (조직도, 거버넌스 구조)
- [x] 개인정보 처리방침 페이지 (12개 조항)
- [x] 이용약관 페이지 (8개 장, 19개 조항)
- [x] 전체 페이지 URL 검증 완료 (14개 페이지 모두 200 OK)

### 진행 중
- [ ] 연혁 페이지 실제 데이터로 업데이트
- [ ] 최종 빌드 및 배포 테스트

## 📝 페이지 구조 및 컨텐츠

### 완성된 주요 페이지

#### 메인 페이지 (`/`)
- **히어로 섹션**: 슬라이더 (React 컴포넌트)
- **비전 섹션**: "모두가 가치있는 삶을 누리는 사회" + 3가지 가치
- **사업소개**: 6개 사업 카드 (재가요양, 장애인지원, 아동청소년, 교육, 사회적가치, 네트워킹)
- **통계 섹션**: 15+년, 200+활동지원사, 500+이용자, 9개 사업영역
- **CTA 섹션**: 활동지원사 모집 안내

#### About 페이지 (`/about`)
- **미션**: 전문적이고 인간중심적인 돌봄 서비스 제공
- **비전**: "모두가 가치있는 삶을 누리는 사회"
- **핵심 가치 6가지**: 존중, 연대, 평등, 지속가능성, 투명성, 전문성
- **특장점 6가지**: 협동조합, 통합돌봄, 전문인력, 지역연계, 사회적가치, 지속혁신

#### 서비스 페이지

**재가방문요양사업** (`/services/elderly`)
- 4가지 서비스: 신체활동, 가사지원, 건강관리, 정서지원
- 장기요양 등급 6개 (1~5등급 + 인지지원)
- 이용 절차 4단계
- 가치로운 특장점 6가지

**장애인활동지원** (`/services/disability`)
- 4가지 서비스: 가정방문, 사회활동, 중증지원, 맞춤형
- 지원시간 안내 (44~180시간, 24시간)
- 본인부담금 테이블 (소득구간별)
- 활동지원사 교육 프로그램 (신규/보수/전문)

**아동청소년지원** (`/services/youth`)
- **교육 지원**: 학습멘토링, 진로탐색, 독서프로그램
- **문화·예술**: 문화체험, 예술활동, 레크리에이션
- **정서 지원**: 심리상담, 자존감향상, 또래관계
- **자립 지원**: 생활기술, 사회적응, 진로준비
- 이용 절차 5단계
- 프로그램 효과 6가지

#### 기타 페이지

**조직 소개** (`/about/organization`)
- 4단계 조직도: 총회 → 이사회/감사 → 사무국 → 4개 팀
- 거버넌스 구조: 총회, 이사회, 감사
- 임원 정보: 이사장 구자애
- 조합원 유형 4가지

**개인정보 처리방침** (`/privacy`)
- 12개 조항: 수집/이용, 제3자 제공, 보유기간 등
- 서비스별 수집 정보 (재가요양, 장애인지원, 아동청소년)
- 개인정보보호책임자 연락처
- coophangang.kr 템플릿 기반 커스터마이징

**이용약관** (`/terms`)
- 8개 장, 19개 조항
- 서비스 이용계약, 이용자 권리/의무, 요금/환불
- 손해배상 및 분쟁해결
- coophangang.kr 템플릿 기반 커스터마이징

## 🔄 문서 유지관리 원칙

### ⚠️ 중요: AGENTS.md 업데이트 규칙

**모든 주요 변경사항은 반드시 이 문서(AGENTS.md)에 반영해야 합니다.**

#### 업데이트가 필요한 경우:
1. **디자인 시스템 변경**
   - 색상 팔레트 수정
   - 타이포그래피 변경
   - 브레이크포인트 조정

2. **아키텍처 변경**
   - 새로운 라이브러리 추가
   - 기술 스택 변경
   - 디렉토리 구조 수정

3. **페이지 구조 변경**
   - 새 페이지 추가
   - 페이지 삭제
   - URL 구조 변경

4. **컨텐츠 패턴 변경**
   - 새로운 섹션 타입 추가
   - 컴포넌트 패턴 변경
   - 데이터 구조 변경

5. **개발 가이드라인 변경**
   - 코딩 컨벤션 수정
   - 새로운 베스트 프랙티스 추가
   - 보안 정책 변경

#### 업데이트 방법:
```markdown
1. 변경 사항을 해당 섹션에 반영
2. "Last Updated" 날짜 갱신
3. 변경 이력을 간단히 기록 (선택사항)
```

#### 예시:
```markdown
**Last Updated**: 2025-11-15
**Recent Changes**:
- 테마 색상을 주황/노랑으로 변경 (기존: 분홍/자몽)
- 아동청소년지원 페이지 4개 프로그램 카테고리로 확장
- 모든 서비스 페이지에 상세 컨텐츠 추가
- 공지사항 페이지 Strapi collection type 통합 (SSR + 실시간 업데이트)
- getAnnouncements() 함수 추가 및 GraphQL 쿼리 구현
- /api/announcements 엔드포인트 추가 (서버 사이드 프록시)
```

### 문서 작성 원칙:
1. **명확성**: 다른 AI 에이전트가 읽고 바로 이해할 수 있도록 작성
2. **구체성**: 추상적인 설명보다 구체적인 코드 예시 제공
3. **최신성**: 프로젝트 변경사항을 즉시 반영
4. **완전성**: 새로운 에이전트가 이 문서만으로 프로젝트를 파악할 수 있어야 함

---

## 🛠 관리자 도구 (Admin Tools)

### 명령 팔레트 (Command Palette)

프로젝트에는 관리자와 개발자를 위한 명령 팔레트 시스템이 구현되어 있습니다.

#### 접근 방법
- **데스크톱**: `Ctrl + Shift + P` (Windows/Linux) 또는 `Cmd + Shift + P` (Mac)
- **모바일**: 푸터 로고를 더블탭

#### 사용 가능한 명령

1. **📥 데이터 재조회**
   - 현재 페이지의 라이브 데이터를 새로고침 없이 다시 가져옵니다
   - `/api/greeting` 엔드포인트를 호출하여 Strapi에서 최신 데이터를 가져옵니다
   - DOM을 직접 업데이트하여 페이지 새로고침 없이 변경사항을 반영합니다
   - 성공/실패 시 토스트 메시지로 결과를 표시합니다

2. **📍 데이터 위치 보기**
   - Strapi에서 수정할 위치를 화면에 오버레이로 표시합니다
   - `data-strapi-path` 속성이 있는 모든 요소 위에 경로 라벨을 표시합니다
   - 라벨을 클릭하면 Strapi 경로가 클립보드에 복사됩니다
   - 예: `single-types > greeting > title`

#### 구현 세부사항

**파일 구조**:
- `src/components/react/CommandPalette.tsx` - React 컴포넌트
- `src/components/react/CommandPalette.css` - 스타일링
- `src/pages/api/greeting.ts` - 서버 API 프록시 (토큰 보안 유지)
- `src/pages/about.astro` - 명령 처리 로직

## 🌐 환경 변수 & Cloudflare 바인딩

### 환경 변수 접근 방식

**현재 구현**: 하이브리드 방식 (빌드 타임 + 런타임)
- **로컬 개발**: `import.meta.env` (`.env.local` 또는 `.dev.vars`)
- **Cloudflare 빌드**: `import.meta.env` (빌드 시점 주입)
- **Cloudflare 런타임(SSR)**: `Astro.locals.runtime.env` (Functions 환경 변수)
- 모든 Strapi API 함수는 `env` 매개변수를 받아 환경별 접근 지원

### 로컬 개발 환경

**방법 1: 기본 Astro 개발 (추천)**
```bash
npm run dev
```
- `wrangler.toml` [vars] 섹션의 로컬 환경 변수 사용
- `.dev.vars` 파일로 secrets 관리 (선택)

**방법 2: Wrangler 로컬 개발 (Cloudflare 시뮬레이션)**
```bash
npm run dev:wrangler
```
- `wrangler.toml` + `.dev.vars` 조합
- Cloudflare Workers 런타임 환경 시뮬레이션

### Cloudflare Pages 배포 설정

**중요**: `wrangler.toml`이 있으면 환경 변수는 소스 코드로 관리됩니다.

1. **wrangler.toml 설정** (이미 완료):
   - `[env.production.vars]`: 프로덕션 환경 변수 (비민감 정보)
   - STRAPI_URL, PUBLIC_GA_ID, PUBLIC_RECAPTCHA_SITE_KEY

2. **Cloudflare Secret 등록** (필수):
```bash
npx wrangler secret put STRAPI_API_TOKEN_READ
```
또는 Cloudflare 대시보드 → Settings → Variables and Secrets → Add Secret

3. **Git 푸시로 자동 배포**:
```bash
git push origin master
```
Cloudflare Pages가 `wrangler.toml`을 읽어서 자동으로 환경 설정

### 토큰 우선순위

```typescript
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN_FULL 
  || import.meta.env.STRAPI_API_TOKEN_READ  // 권장
  || import.meta.env.STRAPI_API_TOKEN       // fallback
  || '';
```

### 보안 모범 사례

- **Read-Only 토큰**: `STRAPI_API_TOKEN_READ` 사용 권장
- **PUBLIC_ 접두사**: 클라이언트 노출 변수는 `PUBLIC_` 필수
- **서버 프록시**: 클라이언트는 `/api/*` 엔드포인트를 통해 Strapi 접근
- **Secrets 분리**: 민감한 값은 절대 클라이언트에 노출 금지

### 상세 가이드

전체 설정 가이드는 `CLOUDFLARE_ENV_GUIDE.md` 참고
**데이터 속성 규칙**:
```html
<!-- Strapi 경로를 나타내는 속성 추가 -->
**Last Updated**: 2025-11-16
  {content}
</div>
```

**보안 고려사항**:
- 모든 Strapi API 호출은 서버 측 프록시(`/api/*`)를 통해 이루어집니다
- 토큰은 절대 클라이언트에 노출되지 않습니다 (`process.env`로만 접근)
- 클라이언트와 서버 간 통신은 `postMessage` API를 사용합니다

### GraphQL 실시간 업데이트 (Subscription vs Polling)

**GraphQL Subscription의 장점**:
- 서버에서 데이터 변경 시 즉시 클라이언트에 푸시
- WebSocket 연결로 실시간 양방향 통신
- 불필요한 폴링(polling) 제거로 네트워크 효율성 향상

**현재 구현 (Polling 기반)**:
- 30초마다 자동으로 데이터 확인 및 업데이트
- 명령 팔레트에서 "🟢 실시간 업데이트 켜기/🔴 끄기"로 제어
- 간단한 구현으로 안정성 보장

**Subscription 구현 계획 (향후 확장)**:
```typescript
// Apollo Client 또는 urql 사용
const SUBSCRIPTION = gql`
  subscription OnGreetingUpdate {
    greetingUpdated {
      title
      body
      writtenby
    }
  }
`;

// React 컴포넌트에서
useSubscription(SUBSCRIPTION, {
  onData: ({ data }) => {
    // 실시간으로 UI 업데이트
    updateGreeting(data.greetingUpdated);
  }
});
```

**기술적 고려사항**:
- WebSocket 연결 관리 (재연결, 에러 처리)
- 클라이언트 라이브러리 추가 (번들 크기 증가)
- SSR 환경에서의 subscription 처리
- 현재 폴링 방식이 관리자용으로는 충분함

---

**Last Updated**: 2025-11-16

**Recent Changes**:
- ✅ **환경 변수 관리 최종 완성**: `wrangler.toml` 중심 전략으로 전환
  - 비민감 정보(STRAPI_URL, PUBLIC_* 등)는 `wrangler.toml` [vars]에 Git 커밋
  - 민감 정보(API 토큰)는 Cloudflare Secrets로 분리 관리
  - `Astro.locals.runtime.env`로 런타임 환경 변수 접근 (빌드/런타임 통합)
  - Cloudflare Pages 대시보드 환경 변수 설정 제거 (wrangler.toml 우선)
- ✅ Cloudflare runtime 환경 변수 접근 패턴 확립: 모든 Strapi API 함수에 `env` 매개변수 추가
- ✅ 실시간 업데이트 기능: 명령 팔레트 Ctrl+Shift+P로 데이터 재조회, Strapi 경로 오버레이
- ✅ GraphQL 스키마 수정: `about { greeting { ... } }` nested 구조로 실제 Strapi 스키마 반영
- ✅ Strapi Rich Text 변환: `strapiRichTextToHtml()` 함수로 JSON → HTML 변환
- ✅ 서버 API 프록시: `/api/greeting`, `/api/announcements` 엔드포인트 추가

**페이지 상태** (2025-11-08):
```
✓ / - 메인 페이지 (슬라이더, 비전, 6개 사업, 통계, CTA)
✓ /about - 소개 (미션, 비전, 6가치, 6특장점)
✓ /about/history - 연혁 (샘플 데이터, 업데이트 필요)
✓ /about/location - 오시는 길 (지도, 연락처)
✓ /about/organization - 조직 소개 (조직도, 거버넌스)
✓ /services - 서비스 소개
✓ /services/elderly - 재가방문요양사업 (4서비스, 6등급, 절차)
✓ /services/disability - 장애인활동지원 (4서비스, 본인부담금, 교육)
✓ /services/youth - 아동청소년지원 (4카테고리 12프로그램)
✓ /notice - 공지사항 (Strapi collection type, 실시간 업데이트)
✓ /recruit - 채용 안내 (준비중)
✓ /privacy - 개인정보 처리방침 (12조항 완료)
✓ /terms - 이용약관 (8장 19조항 완료)

Total: 14 pages, All returning HTTP 200
```

**AI Agent**: 이 문서를 기반으로 프로젝트를 이해하고 작업을 수행하세요.
작업 후에는 반드시 이 문서를 업데이트하여 다음 에이전트가 참고할 수 있도록 하세요.
