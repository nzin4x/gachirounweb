# 배포 가이드

## Cloudflare Pages 배포 방법

### 1. GitHub 저장소 연결 (권장)

1. **GitHub에 저장소 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Cloudflare Pages에서 저장소 연결**
   - [Cloudflare Dashboard](https://dash.cloudflare.com/) 로그인
   - Pages > Create a project > Connect to Git
   - GitHub 저장소 선택

3. **빌드 설정**
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `18` (Environment variables에서 설정)

4. **환경 변수 설정**
   ```
   NODE_VERSION=18
   STRAPI_URL=<your-strapi-url>
   STRAPI_API_TOKEN=<your-token>
   PUBLIC_GA_ID=<your-ga-id>
   PUBLIC_RECAPTCHA_SITE_KEY=<your-site-key>
   RECAPTCHA_SECRET_KEY=<your-secret-key>
   ```

5. **배포**
   - "Save and Deploy" 클릭
   - 자동으로 빌드 및 배포 시작

### 2. Wrangler CLI 직접 배포

1. **Wrangler 설치**
   ```bash
   npm install -g wrangler
   ```

2. **Cloudflare 로그인**
   ```bash
   wrangler login
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **배포**
   ```bash
   wrangler pages deploy dist --project-name=gachiroun-homepage
   ```

### 3. 로컬에서 프로덕션 빌드 테스트

```bash
# 빌드
npm run build

# 프리뷰 (Astro preview)
npm run preview

# Wrangler로 프리뷰
wrangler pages dev dist
```

## 배포 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] .env 파일이 .gitignore에 포함되어 있는지 확인
- [ ] 빌드 오류 없이 완료되는지 확인
- [ ] 로컬에서 프리뷰로 테스트
- [ ] 이미지 및 에셋 경로 확인
- [ ] SEO 메타 태그 확인
- [ ] 반응형 디자인 테스트 (모바일/태블릿/데스크톱)
- [ ] Google Analytics 작동 확인
- [ ] Cloudflare Pages 커스텀 도메인 설정 (gachiroun.or.kr)

## 커스텀 도메인 설정

1. Cloudflare Pages 프로젝트 > Custom domains
2. "Set up a custom domain" 클릭
3. `gachiroun.or.kr` 또는 `www.gachiroun.or.kr` 입력
4. DNS 레코드 자동 설정 (Cloudflare DNS 사용 시)

## 지속적 배포 (CI/CD)

GitHub 저장소 연결 시 자동으로 설정됩니다:
- `main` 브랜치에 푸시 → 프로덕션 배포
- Pull Request 생성 → 프리뷰 배포 생성
- 커밋마다 자동 빌드 및 배포

## 트러블슈팅

### 빌드 오류

**문제**: Node 버전 오류
```
해결: Cloudflare Pages 환경 변수에 NODE_VERSION=18 추가
```

**문제**: 모듈을 찾을 수 없음
```bash
# 캐시 정리 및 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### SSR 관련

**문제**: Server-side rendering 오류
```
해결: astro.config.mjs에서 output: 'server' 확인
      adapter: cloudflare() 설정 확인
```

### 환경 변수

**문제**: 환경 변수가 로드되지 않음
```
해결: 
- PUBLIC_ 접두사가 필요한 변수 확인 (클라이언트 사이드)
- Cloudflare Pages 대시보드에서 환경 변수 설정 확인
```

## 성능 최적화

1. **이미지 최적화**
   - WebP 포맷 사용
   - 적절한 크기로 리사이징
   - Lazy loading 적용

2. **CSS 최적화**
   - 불필요한 스타일 제거
   - CSS 번들 크기 최소화

3. **JavaScript 최적화**
   - 코드 스플리팅
   - Tree shaking
   - 클라이언트 하이드레이션 최소화 (client:* 디렉티브 적절히 사용)

4. **캐싱 전략**
   - Cloudflare CDN 활용
   - 정적 에셋 캐싱
   - Cache-Control 헤더 설정

## 모니터링

- Cloudflare Analytics에서 트래픽 확인
- Google Analytics로 사용자 행동 분석
- Cloudflare Pages 빌드 로그 확인

---

**마지막 업데이트**: 2025-11-07
