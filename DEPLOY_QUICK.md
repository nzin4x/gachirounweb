# 🚀 Cloudflare Pages 배포 - 빠른 시작 가이드

## ✅ 빌드 테스트 완료!

프로덕션 빌드가 성공적으로 완료되었습니다.
- 빌드 시간: ~3초
- 클라이언트 번들: 186KB (gzip: 58KB)
- 30개 모듈 변환 완료

---

## 🎯 추천: GitHub 자동 배포 (5분 소요)

### 1단계: 코드 푸시
```bash
cd c:/lsrc/gachiroun/homepage

# 모든 변경사항 커밋
git add .
git commit -m "feat: 전체 페이지 완성 및 Cloudflare 배포 준비"
git push origin master
```

### 2단계: Cloudflare Pages 설정

1. **https://dash.cloudflare.com** 접속 및 로그인

2. 왼쪽 메뉴에서 **"Workers & Pages"** 클릭

3. **"Create application"** 버튼 클릭

4. **"Pages"** 탭 선택 → **"Connect to Git"** 클릭

5. **GitHub 저장소 연결**
   - GitHub 계정 연동 (처음이면 OAuth 승인)
   - Repository 선택: `nzin4x/gachirounweb` (또는 현재 저장소)
   - "Begin setup" 클릭

6. **빌드 설정 입력**
   ```
   Project name: gachiroun-or-kr
   Production branch: master
   
   Framework preset: Astro (자동 감지됨)
   Build command: npm run build
   Build output directory: dist
   Root directory: (비워둠)
   ```

7. **환경 변수 추가** (선택사항)
   - "Add variable" 클릭
   ```
   NODE_VERSION = 18
   ```

8. **"Save and Deploy"** 클릭

9. **배포 진행 확인**
   - 빌드 로그 실시간 확인 가능
   - 약 2-3분 소요

10. **배포 완료!**
    - 배포 URL: `https://gachiroun.or.kr`
    - 이 URL로 바로 접속 가능

---

## 🔄 이후 배포 (초간단!)

```bash
# 파일 수정 후
git add .
git commit -m "수정 내용"
git push origin master

# 끝! 자동으로 Cloudflare Pages가 배포합니다.
```

Cloudflare 대시보드에서 배포 상태 실시간 확인 가능

---

## 🌐 커스텀 도메인 연결 (선택)

배포 완료 후 `gachiroun.or.kr` 도메인을 연결하려면:

1. Cloudflare Pages 프로젝트 페이지에서 **"Custom domains"** 클릭

2. **"Set up a custom domain"** 클릭

3. 도메인 입력: `gachiroun.or.kr`

4. DNS 설정 (자동 또는 수동)
   - Cloudflare에서 도메인 관리 중: 자동 설정
   - 다른 곳에서 관리 중: CNAME 레코드 추가 필요

5. SSL 인증서 자동 발급 (무료)

6. 완료! `https://gachiroun.or.kr`로 접속 가능

---

## 📊 배포 후 확인사항

배포 완료 후 다음을 확인하세요:

### 필수 체크
- [ ] 메인 페이지 로딩
- [ ] 모든 링크 작동 (14개 페이지)
- [ ] 슬라이더 작동
- [ ] 모바일 반응형 확인
- [ ] HTTPS 활성화 확인

### URL 목록
```
https://your-site.pages.dev/
https://your-site.pages.dev/about
https://your-site.pages.dev/about/history
https://your-site.pages.dev/about/location
https://your-site.pages.dev/about/organization
https://your-site.pages.dev/services
https://your-site.pages.dev/services/elderly
https://your-site.pages.dev/services/disability
https://your-site.pages.dev/services/youth
https://your-site.pages.dev/notice
https://your-site.pages.dev/recruit
https://your-site.pages.dev/privacy
https://your-site.pages.dev/terms
```

---

## ❓ 문제 해결

### 빌드 실패 시
1. Cloudflare 대시보드 → Deployments → 실패한 빌드 클릭
2. 로그 확인
3. 대부분의 경우: 환경 변수 `NODE_VERSION=18` 추가

### 페이지가 안 보일 때
- 빌드 설정 확인: `Build output directory`가 `dist`인지 확인
- 캐시 지우고 다시 로드 (Ctrl+Shift+R)

### 404 에러
- SSR 설정이 올바른지 확인 (astro.config.mjs)
- Cloudflare adapter가 설치되어 있는지 확인

---

## 🎉 배포 완료 후

축하합니다! 이제 웹사이트가 전 세계에 공개되었습니다.

**주요 기능:**
- ⚡ 빠른 로딩 (Cloudflare 글로벌 CDN)
- 🔒 무료 SSL (HTTPS 자동)
- 🔄 자동 배포 (Git push → 자동 빌드)
- 📊 배포 히스토리 관리
- ⏮️ 쉬운 롤백 (클릭 한 번)

**성능:**
- 전 세계 어디서나 빠른 로딩
- 무제한 대역폭
- DDoS 보호

---

**다음 단계:**
1. 실제 데이터로 연혁 페이지 업데이트
2. Google Analytics 연동 (선택)
3. 공지사항/채용 페이지 Strapi 연동 (선택)
4. SEO 최적화 (sitemap.xml, robots.txt)

**도움이 필요하면 언제든 물어보세요! 🚀**
