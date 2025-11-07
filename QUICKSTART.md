# 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1. 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:4321 열기

### 4. 빌드
```bash
npm run build
```

### 5. 배포 (Cloudflare Pages)
```bash
npm run deploy
```

## 📚 더 자세한 문서

- [README.md](./README.md) - 프로젝트 전체 개요
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드
- [AGENTS.md](./AGENTS.md) - AI 에이전트용 가이드

## 🎯 현재 구현 상태

✅ **완료된 기능**
- SSR 지원 Astro + React 프로젝트 설정
- 기본 레이아웃 및 테마 (꽃 테마 - 분홍/자몽색 + 초록색)
- 아리따돋움 웹폰트 적용
- 반응형 디자인 (PC/모바일)
- 메인 페이지 (슬라이딩 배너 포함)
- 소개 페이지 (조합 소개, 연혁)
- 서비스 페이지 (노인복지)
- 활동지원사 구직신청 페이지
- SEO 최적화 (메타 태그, Open Graph)
- Cloudflare Pages 배포 설정
- Google Analytics 준비 완료

🔄 **진행 중**
- 추가 페이지 구현
- Strapi CMS 연동 준비

📝 **예정된 기능**
- Strapi CMS 완전 연동
- 공지사항 시스템
- 레이어드 팝업
- Google Forms 연동
- reCAPTCHA 통합
- 더 많은 서비스 페이지

## 🌐 페이지 구조

현재 구현된 페이지:
- `/` - 메인 페이지 ✅
- `/about` - 조합 소개 ✅
- `/about/history` - 연혁 ✅
- `/services/elderly` - 노인복지 ✅
- `/recruit` - 활동지원사 구직신청 ✅

추가 예정:
- `/about/organization` - 조직도
- `/about/location` - 오시는 길
- `/services/disability` - 장애인 지원
- `/services/youth` - 청소년 지원
- `/notice` - 공지사항
- `/notice/[id]` - 공지사항 상세

## 🎨 디자인 시스템

### 색상
- **Primary (분홍/자몽)**: `#f43f5e`
- **Secondary (초록)**: `#22c55e`
- 더 많은 색상은 `src/styles/global.css` 참조

### 폰트
- 아리따돋움 웹폰트 (CDN)

### 반응형 브레이크포인트
- Mobile: ~ 767px
- Tablet: 768px ~ 1023px
- Desktop: 1024px ~

## 📞 문의

프로젝트에 대한 문의사항이 있으시면:
- Email: info@gachiroun.or.kr
- Website: gachiroun.or.kr

---

**Last Updated**: 2025-11-07
