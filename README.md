# 사회적협동조합 가치로운 홈페이지

> 사회적협동조합 가치로운(gachiroun.or.kr) 공식 웹사이트

전문적이고 인간중심적인 돌봄 서비스를 제공하는 사회적협동조합 가치로운의 소개 웹사이트입니다.

## ✨ 주요 기능

- 🎨 **브랜드 컬러**: 주황(#FF6B35) + 노랑(#FFB800) 테마
- ⚡ **SSR**: Astro 서버 사이드 렌더링으로 빠른 로딩
- 📱 **반응형**: 모바일, 태블릿, 데스크톱 모두 지원
- ♿ **접근성**: WCAG 2.1 AA 레벨 준수
- 🔍 **SEO**: 검색엔진 최적화
- 🚀 **Cloudflare Pages**: 글로벌 CDN 배포

## 📄 페이지 구성

### 메인
- `/` - 홈페이지 (비전, 6개 사업 소개, 통계)

### 소개
- `/about` - 조합 소개 (미션, 비전, 핵심 가치 6가지)
- `/about/history` - 연혁
- `/about/location` - 오시는 길
- `/about/organization` - 조직 구조

### 서비스
- `/services` - 서비스 소개
- `/services/elderly` - 재가방문요양사업
- `/services/disability` - 장애인활동지원
- `/services/youth` - 아동청소년지원

### 기타
- `/notice` - 공지사항
- `/recruit` - 채용 안내
- `/privacy` - 개인정보 처리방침
- `/terms` - 이용약관

## 🏗 기술 스택

- **프레임워크**: Astro 5.15.4 (SSR)
- **UI 라이브러리**: React 19.2.0
- **언어**: TypeScript (strict mode)
- **배포**: Cloudflare Pages
- **폰트**: 아리따돋움
- **빌드 도구**: Vite 7

## 🚀 프로젝트 구조

```text
homepage/
├── src/
│   ├── pages/              # 페이지 (파일 기반 라우팅)
│   │   ├── index.astro
│   │   ├── about/
│   │   ├── services/
│   │   ├── notice/
│   │   ├── privacy.astro
│   │   └── terms.astro
│   ├── components/         # 컴포넌트
│   │   ├── astro/
│   │   └── react/
│   ├── layouts/            # 레이아웃
│   └── styles/             # 스타일
├── public/                 # 정적 파일
├── astro.config.mjs        # Astro 설정
└── package.json
```

## 🧞 명령어

프로젝트 루트에서 실행하세요:

| 명령어 | 설명 |
| :--- | :--- |
| `npm install` | 의존성 설치 |
| `npm run dev` | 개발 서버 시작 (localhost:4321) |
| `npm run build` | 프로덕션 빌드 (./dist/) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run deploy` | Cloudflare Pages에 배포 |

## 🚀 배포하기

### GitHub 자동 배포 (권장)

1. **코드 푸시**
   ```bash
   git add .
   git commit -m "업데이트 내용"
   git push origin master
   ```

2. **Cloudflare Pages 설정** (최초 1회)
   - https://dash.cloudflare.com 로그인
   - Workers & Pages → Create application → Pages
   - GitHub 저장소 연결
   - 빌드 설정:
     ```
     Build command: npm run build
     Build output directory: dist
     Environment variables: NODE_VERSION=18
     ```

3. **완료!** 이후 push할 때마다 자동 배포됩니다.

자세한 내용: [DEPLOY_QUICK.md](./DEPLOY_QUICK.md) 참고

## 🎨 디자인 시스템

### 색상 팔레트

```css
/* Primary - 주황색 (열정, 보람, 의의) */
--color-primary-500: #FF6B35;

/* Accent - 노랑색 (희망, 즐거움, 뜻) */
--color-accent-500: #FFB800;

/* Secondary - 초록색 (성장, 생명) */
--color-secondary-500: #22c55e;
```

### 타이포그래피

- **폰트**: 아리따돋움 (Arita-dotum)
- **굵기**: 400 (Regular), 700 (Bold)

## 📚 문서

- [배포 가이드](./DEPLOY.md) - 상세한 배포 방법
- [빠른 배포](./DEPLOY_QUICK.md) - 5분 안에 배포하기
- [AI 개발 가이드](./AGENTS.md) - AI 에이전트를 위한 프로젝트 가이드

## 🔧 개발 가이드

### 개발 서버 시작

```bash
npm run dev
```

http://localhost:4321 에서 확인

### 새 페이지 추가

1. `src/pages/` 에 `.astro` 파일 생성
2. 파일명이 URL이 됨 (예: `about.astro` → `/about`)
3. `MainLayout` 사용하여 일관성 유지

### React 컴포넌트 추가

1. `src/components/react/` 에 `.tsx` 파일 생성
2. Astro 페이지에서 임포트
3. `client:load` 등 디렉티브로 하이드레이션 지정

## 🎨 아이콘 및 Favicon

### 아이콘 생성

`public/images/ci.png`를 기반으로 다양한 아이콘 생성:

```bash
# 임시 아이콘 생성 (복사본)
bash generate-icons.sh

# ImageMagick 사용 (실제 리사이즈)
bash generate-icons-imagemagick.sh
```

### 온라인 도구 (권장)

- [Favicon Generator](https://realfavicongenerator.net/)
- `ci.png` 업로드 → 모든 플랫폼용 favicon 자동 생성

자세한 내용: [ICONS_GUIDE.md](./ICONS_GUIDE.md)

## 🧪 테스트

### URL 전체 점검

```bash
bash check-urls.sh
```

14개 모든 페이지가 200 OK 응답하는지 확인

### 프로덕션 빌드 테스트

```bash
npm run build
npm run preview
```

## 📞 연락처

**사회적협동조합 가치로운**
- 주소: 서울 강남구 테헤란로 406 샹제리제타워 A동 C111호
- 전화: 010-6549-8765
- 이메일: nzin4x@gmail.com

## 📝 라이선스

Copyright © 2024 사회적협동조합 가치로운. All rights reserved.
