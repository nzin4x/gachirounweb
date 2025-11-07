# 개발 가이드

## 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 pnpm

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 필요한 값 입력
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:4321 열기

## 프로젝트 구조

```
src/
├── components/          # 컴포넌트
│   ├── SEO.astro       # SEO 메타 태그
│   ├── Header.astro    # 헤더
│   ├── Footer.astro    # 푸터
│   └── react/          # React 컴포넌트
│       └── Slider.tsx  # 슬라이더
├── layouts/            # 레이아웃
│   └── MainLayout.astro
├── pages/              # 페이지 (파일 기반 라우팅)
│   ├── index.astro     # 메인 페이지
│   ├── about/          # 소개 페이지들
│   ├── services/       # 사업 안내 페이지들
│   ├── recruit.astro   # 구직신청
│   └── notice/         # 공지사항 (향후 추가)
├── styles/             # 스타일
│   └── global.css      # 전역 스타일
└── lib/                # 유틸리티 (향후 추가)
    └── strapi.ts       # Strapi API 클라이언트
```

## 페이지 추가하기

### 정적 페이지

`src/pages/` 디렉토리에 `.astro` 파일 생성:

```astro
---
import MainLayout from '../layouts/MainLayout.astro';
---

<MainLayout title="페이지 제목" description="페이지 설명">
  <section class="page-hero">
    <div class="container">
      <h1>페이지 제목</h1>
    </div>
  </section>
  
  <section class="section">
    <div class="container">
      <!-- 내용 -->
    </div>
  </section>
</MainLayout>
```

### 동적 페이지

동적 경로를 위해 `[param].astro` 형식 사용:

```astro
---
// src/pages/notice/[id].astro
export async function getStaticPaths() {
  // Strapi에서 데이터 가져오기
  const notices = await fetch('...').then(r => r.json());
  
  return notices.map(notice => ({
    params: { id: notice.id },
    props: { notice },
  }));
}

const { notice } = Astro.props;
---

<MainLayout title={notice.title}>
  <!-- 내용 -->
</MainLayout>
```

## React 컴포넌트 사용하기

### 컴포넌트 생성

`src/components/react/` 디렉토리에 `.tsx` 파일 생성:

```tsx
// src/components/react/MyComponent.tsx
import { useState } from 'react';
import './MyComponent.css';

interface Props {
  initialValue: string;
}

export default function MyComponent({ initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  
  return (
    <div>
      <p>{value}</p>
    </div>
  );
}
```

### Astro 페이지에서 사용

```astro
---
import MyComponent from '../components/react/MyComponent';
---

<MainLayout title="테스트">
  <!-- client:load - 즉시 로드 -->
  <MyComponent client:load initialValue="Hello" />
  
  <!-- client:visible - 뷰포트에 보일 때 로드 -->
  <MyComponent client:visible initialValue="Hello" />
  
  <!-- client:idle - 브라우저가 idle 상태일 때 로드 -->
  <MyComponent client:idle initialValue="Hello" />
</MainLayout>
```

## 스타일링

### 전역 스타일

`src/styles/global.css`에 전역 스타일이 정의되어 있습니다.

CSS 변수 사용:
```css
.my-element {
  color: var(--color-primary-600);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}
```

### 컴포넌트 스타일

Astro 컴포넌트 내부에 `<style>` 태그 사용 (스코프됨):

```astro
<div class="my-component">
  <!-- 내용 -->
</div>

<style>
  .my-component {
    /* 이 스타일은 이 컴포넌트에만 적용됨 */
  }
</style>
```

## Strapi 연동 (향후)

### API 클라이언트 설정

```typescript
// src/lib/strapi.ts
const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

export async function getNotices() {
  const response = await fetch(`${STRAPI_URL}/notices`, {
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
  });
  return response.json();
}
```

### 페이지에서 사용

```astro
---
import { getNotices } from '../lib/strapi';

const notices = await getNotices();
---

<MainLayout title="공지사항">
  {notices.data.map(notice => (
    <article>
      <h2>{notice.attributes.title}</h2>
      <p>{notice.attributes.content}</p>
    </article>
  ))}
</MainLayout>
```

## 빌드 및 테스트

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

### Wrangler로 로컬 테스트

```bash
wrangler pages dev dist
```

## 코딩 컨벤션

### 파일명
- Astro 컴포넌트: PascalCase (예: `MainLayout.astro`)
- React 컴포넌트: PascalCase (예: `Slider.tsx`)
- 페이지: kebab-case (예: `about-us.astro`)
- 유틸리티: camelCase (예: `strapi.ts`)

### 코드 스타일
- 들여쓰기: 2 spaces
- 따옴표: 작은따옴표 우선
- 세미콜론: 선택사항 (일관성 유지)

### 컴포넌트 구조
```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';
import Component from '../components/Component.astro';

// 2. Props interface
interface Props {
  title: string;
}

// 3. Props destructuring
const { title } = Astro.props;

// 4. Logic
const data = await fetchData();
---

<!-- 5. Template -->
<Layout>
  <Component />
</Layout>

<!-- 6. Styles -->
<style>
  /* ... */
</style>
```

## Git 워크플로우

### 브랜치 전략
- `main`: 프로덕션
- `develop`: 개발
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

## 디버깅

### 개발 도구
- Astro Dev Toolbar 사용
- React DevTools 설치
- VS Code Astro 확장 프로그램

### 로깅
```astro
---
console.log('Server-side log');
const data = await fetchData();
console.log('Data:', data);
---

<script>
  console.log('Client-side log');
</script>
```

## 자주 묻는 질문

### Q: React 컴포넌트가 작동하지 않아요
A: `client:*` 디렉티브를 추가했는지 확인하세요.

### Q: 환경 변수가 undefined예요
A: 클라이언트에서 사용할 변수는 `PUBLIC_` 접두사가 필요합니다.

### Q: 스타일이 적용되지 않아요
A: 전역 CSS가 레이아웃에서 import되었는지 확인하세요.

---

**도움이 필요하신가요?** 이슈를 등록하거나 팀에 문의하세요.
