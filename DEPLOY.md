# Cloudflare Pages 배포 가이드

## 방법 1: GitHub 연동 (권장)

가장 쉽고 자동화된 방법입니다. Git push만 하면 자동으로 배포됩니다.

### 1단계: GitHub 저장소 확인
```bash
# 현재 저장소 상태 확인
git remote -v

# 최신 변경사항 푸시
git add .
git commit -m "feat: 전체 페이지 완성 및 배포 준비"
git push origin master
```

### 2단계: Cloudflare Pages 설정

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com 로그인
   - 왼쪽 메뉴에서 "Workers & Pages" 선택

2. **새 프로젝트 생성**
   - "Create application" 버튼 클릭
   - "Pages" 탭 선택
   - "Connect to Git" 선택

3. **GitHub 저장소 연결**
   - GitHub 계정 연동 (처음이면 OAuth 승인)
   - 저장소 선택: `nzin4x/gachirounweb` 또는 `nzin4x/gachiroun`
   - "Begin setup" 클릭

4. **빌드 설정**
   ```
   Project name: gachiroun-homepage
   Production branch: master
   
   Build settings:
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist
   
   Environment variables:
   NODE_VERSION: 18
   ```

5. **배포 시작**
   - "Save and Deploy" 클릭
   - 첫 빌드가 자동으로 시작됩니다 (약 2-3분 소요)

6. **배포 완료**
   - 배포 완료 후 URL 제공: `https://gachiroun-homepage.pages.dev`
   - Custom domain 설정 가능: `gachiroun.or.kr`

### 자동 배포
이후부터는 `master` 브랜치에 push할 때마다 자동으로 배포됩니다!

```bash
git add .
git commit -m "업데이트 내용"
git push origin master
# → 자동으로 Cloudflare Pages가 빌드 & 배포
```

---

## 방법 2: Wrangler CLI (수동)

로컬에서 직접 배포하는 방법입니다.

### 1단계: Wrangler 설치
```bash
npm install -g wrangler
```

### 2단계: Cloudflare 로그인
```bash
wrangler login
```
브라우저가 열리면 Cloudflare 계정으로 로그인

### 3단계: 빌드
```bash
npm run build
```

### 4단계: 배포
```bash
# 첫 배포
wrangler pages deploy dist --project-name=gachiroun-homepage

# 이후 배포 (package.json에 스크립트 있음)
npm run deploy
```

### 5단계: 배포 확인
배포 완료 후 제공되는 URL로 접속하여 확인

---

## 커스텀 도메인 설정

### gachiroun.or.kr 연결하기

1. **Cloudflare Pages 대시보드**
   - 프로젝트 선택
   - "Custom domains" 탭

2. **도메인 추가**
   - "Set up a custom domain" 클릭
   - `gachiroun.or.kr` 입력
   - "Continue" 클릭

3. **DNS 설정**
   
   **도메인이 이미 Cloudflare에 있는 경우:**
   - 자동으로 CNAME 레코드 생성됨
   
   **도메인이 다른 곳에 있는 경우:**
   - 도메인 등록업체에서 DNS 설정
   ```
   Type: CNAME
   Name: @ (또는 비워둠)
   Value: gachiroun-homepage.pages.dev
   ```

4. **SSL/TLS 설정**
   - Cloudflare에서 자동으로 무료 SSL 인증서 발급
   - HTTPS 자동 활성화

---

## 환경 변수 설정

만약 API 키 등이 필요하면:

1. **Cloudflare Pages 대시보드**
   - 프로젝트 선택
   - "Settings" → "Environment variables"

2. **변수 추가**
   ```
   STRAPI_URL=https://your-strapi-url.com
   STRAPI_API_TOKEN=your-token
   PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **재배포**
   - 환경 변수 변경 후 재배포 필요

---

## 빌드 확인

배포 전 로컬에서 프로덕션 빌드 테스트:

```bash
# 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

http://localhost:4321 에서 프로덕션 빌드 확인

---

## 문제 해결

### 빌드 실패 시

1. **Node 버전 확인**
   - Cloudflare Pages에서 Node 18 사용 권장
   - Environment variables에 `NODE_VERSION=18` 설정

2. **의존성 문제**
   ```bash
   # 로컬에서 깨끗한 빌드 테스트
   rm -rf node_modules
   npm install
   npm run build
   ```

3. **빌드 로그 확인**
   - Cloudflare Pages 대시보드 → Deployments
   - 실패한 빌드 클릭 → 로그 확인

### 404 에러

- `astro.config.mjs`에서 `output: 'server'` 확인
- `adapter: cloudflare()` 설정 확인

### 환경 변수 문제

- 프론트엔드에서 사용하는 변수는 `PUBLIC_` 접두사 필요
- 예: `PUBLIC_GA_ID`, `PUBLIC_RECAPTCHA_SITE_KEY`

---

## 배포 체크리스트

배포 전 확인사항:

- [ ] `npm run build` 로컬에서 성공
- [ ] 모든 페이지 정상 작동 확인 (14개 페이지)
- [ ] 환경 변수 설정 (필요한 경우)
- [ ] Git 저장소에 최신 코드 push
- [ ] `astro.config.mjs`에 올바른 `site` URL 설정
- [ ] 커스텀 도메인 DNS 설정 (필요한 경우)

---

## 추천 배포 방법

**처음 배포**: GitHub 연동 (방법 1) 사용
- 설정 한 번만 하면 됨
- 이후 git push만으로 자동 배포
- 배포 히스토리 관리 용이
- 롤백 쉬움

**긴급 수정**: Wrangler CLI (방법 2) 사용
- 빠른 핫픽스 가능
- GitHub 거치지 않고 즉시 배포

---

**배포 URL**: 
- 기본: `https://gachiroun-homepage.pages.dev`
- 커스텀: `https://gachiroun.or.kr` (DNS 설정 후)
