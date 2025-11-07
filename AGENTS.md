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

### 색상 팔레트 (가치로운 꽃 테마)

**이미지 참조**: 가치로운 브랜드 이미지에서 주황과 노랑색 중심, 녹색 보조

```css
:root {
  /* Primary - 주황색 (열정, 보람, 의의) */
  --color-primary-50: #fff7ed;
  --color-primary-100: #ffedd5;
  --color-primary-200: #fed7aa;
  --color-primary-300: #fdba74;
  --color-primary-400: #fb923c;
  --color-primary-500: #FF6B35;  /* 메인 주황 - "가"의 색상 */
  --color-primary-600: #ea580c;
  --color-primary-700: #c2410c;
  
  /* Accent - 노랑색 (희망, 즐거움, 뜻) */
  --color-accent-50: #fefce8;
  --color-accent-100: #fef9c3;
  --color-accent-200: #fef08a;
  --color-accent-300: #fde047;
  --color-accent-400: #facc15;
  --color-accent-500: #FFB800;  /* 메인 노랑 - "갈"의 의미 */
  --color-accent-600: #ca8a04;
  --color-accent-700: #a16207;
  
  /* Secondary - 초록색 (성장, 생명, 노랑은 희망과 즐거움) */
  --color-secondary-50: #f0fdf4;
  --color-secondary-100: #dcfce7;
  --color-secondary-200: #bbf7d0;
  --color-secondary-300: #86efac;
  --color-secondary-400: #4ade80;
  --color-secondary-500: #22c55e;  /* 꽃잎 녹색 */
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

### 브랜드 의미

**가치로운의 조성**: '가'(값) + '치'(값)
- **주황색**: 열정, 보람, 의의를 나타냄
- **노랑색**: 희망, 즐거움, 밝은 미래를 상징
- **녹색**: 성장, 생명, 지속가능성을 의미 (보조색상)

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

**최신 목표**: PDF 기반 상세 컨텐츠로 전면 개편 완료

### 완료 체크리스트
- [x] Astro 프로젝트 초기 설정
- [x] 기본 레이아웃 구현 (Header, Footer, SEO)
- [x] 메인 페이지 구현 (슬라이더, 비전, 사업소개, 통계)
- [x] 주요 페이지 구조 생성
- [x] Cloudflare 어댑터 설정
- [x] 테마 색상 변경 (주황 #FF6B35, 노랑 #FFB800)
- [x] About 페이지 상세화 (미션/비전/가치 6가지/특장점 6가지)
- [x] 재가방문요양 페이지 (서비스/등급/절차 상세)
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
- **사업 소개**: 6개 사업 카드 (재가요양, 장애인지원, 아동청소년, 교육, 사회적가치, 네트워킹)
- **통계 섹션**: 15+년, 200+활동지원사, 500+이용자, 9개 사업영역
- **CTA 섹션**: 활동지원사 모집 안내

#### About 페이지 (`/about`)
- **미션**: 전문적이고 인간중심적인 돌봄 서비스 제공
- **비전**: "모두가 가치있는 삶을 누리는 사회"
- **핵심 가치 6가지**: 존중, 연대, 평등, 지속가능성, 투명성, 전문성
- **특장점 6가지**: 협동조합, 통합돌봄, 전문인력, 지역연계, 사회적가치, 지속혁신

#### 서비스 페이지

**재가방문요양** (`/services/elderly`)
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
- 임원 정보: 이사장 전승호
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
**Last Updated**: 2025-11-08
**Recent Changes**:
- 테마 색상을 주황/노랑으로 변경 (기존: 분홍/자몽)
- 아동청소년지원 페이지 4개 프로그램 카테고리로 확장
- 모든 서비스 페이지에 상세 컨텐츠 추가
```

### 문서 작성 원칙:
1. **명확성**: 다른 AI 에이전트가 읽고 바로 이해할 수 있도록 작성
2. **구체성**: 추상적인 설명보다 구체적인 코드 예시 제공
3. **최신성**: 프로젝트 변경사항을 즉시 반영
4. **완전성**: 새로운 에이전트가 이 문서만으로 프로젝트를 파악할 수 있어야 함

---

**Last Updated**: 2025-11-08 (23:30 KST)

**Recent Changes**:
- ✅ 조직 소개 페이지 생성 (organization.astro) - 4단계 조직도, 거버넌스 구조
- ✅ 개인정보 처리방침 페이지 생성 (privacy.astro) - 12개 조항, coophangang.kr 기반
- ✅ 이용약관 페이지 생성 (terms.astro) - 8개 장 19개 조항, coophangang.kr 기반
- ✅ 전체 URL 검증 완료: 14개 페이지 모두 200 OK 확인
- ✅ URL 체크 스크립트 생성 (check-urls.sh)
- 테마 색상 변경: 주황(#FF6B35) + 노랑(#FFB800) + 녹색(보조)
- 서비스 페이지 3개 전면 개편 (재가요양, 장애인활동지원, 아동청소년지원)
- About 페이지 미션/비전/가치/특장점 상세화
- 메인 페이지 비전/통계 섹션 추가

**페이지 상태** (2025-11-08):
```
✓ / - 메인 페이지 (슬라이더, 비전, 6개 사업, 통계, CTA)
✓ /about - 소개 (미션, 비전, 6가치, 6특장점)
✓ /about/history - 연혁 (샘플 데이터, 업데이트 필요)
✓ /about/location - 오시는 길 (지도, 연락처)
✓ /about/organization - 조직 소개 (조직도, 거버넌스)
✓ /services - 서비스 소개
✓ /services/elderly - 재가방문요양 (4서비스, 6등급, 절차)
✓ /services/disability - 장애인활동지원 (4서비스, 본인부담금, 교육)
✓ /services/youth - 아동청소년지원 (4카테고리 12프로그램)
✓ /notice - 공지사항 (준비중)
✓ /recruit - 채용 안내 (준비중)
✓ /privacy - 개인정보 처리방침 (12조항 완료)
✓ /terms - 이용약관 (8장 19조항 완료)

Total: 14 pages, All returning HTTP 200
```

**AI Agent**: 이 문서를 기반으로 프로젝트를 이해하고 작업을 수행하세요.
작업 후에는 반드시 이 문서를 업데이트하여 다음 에이전트가 참고할 수 있도록 하세요.
