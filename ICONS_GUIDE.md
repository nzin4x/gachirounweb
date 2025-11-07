# 아이콘 및 이미지 준비 가이드

## 필요한 이미지 파일들

`public/images/ci.png`를 기반으로 다음 파일들을 생성해야 합니다:

### 1. Favicon 
- `public/favicon.ico` (16x16, 32x32, 48x48 멀티 사이즈)
- `public/favicon.svg` (벡터, 권장)
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`

### 2. Apple Touch Icon (iOS 바탕화면 아이콘)
- `public/apple-touch-icon.png` (180x180px)

### 3. Android/PWA 아이콘
- `public/android-chrome-192x192.png` (192x192px)
- `public/android-chrome-512x512.png` (512x512px)

### 4. Open Graph / SNS 공유 이미지
- `public/images/og-image.jpg` (1200x630px) - 현재 있음, ci.png 기반으로 교체

### 5. PWA Manifest 아이콘들
- `public/icon-192.png` (192x192px)
- `public/icon-512.png` (512x512px)
- `public/icon-maskable-192.png` (192x192px, Safe Zone 적용)
- `public/icon-maskable-512.png` (512x512px, Safe Zone 적용)

---

## 자동 생성 방법

### 온라인 도구 사용 (가장 쉬움)

1. **Favicon Generator**: https://realfavicongenerator.net/
   - `ci.png` 업로드
   - 모든 플랫폼용 favicon + manifest 자동 생성
   - 다운로드 후 `public/` 폴더에 배치

2. **PWA Asset Generator**: https://progressier.com/pwa-icons-and-splash-screen-generator
   - `ci.png` 업로드
   - PWA 아이콘들 자동 생성

### 수동 생성 (ImageMagick 사용)

```bash
# Favicon
convert public/images/ci.png -resize 16x16 public/favicon-16x16.png
convert public/images/ci.png -resize 32x32 public/favicon-32x32.png
convert public/images/ci.png -resize 48x48 public/favicon-48x48.png
convert public/favicon-16x16.png public/favicon-32x32.png public/favicon-48x48.png public/favicon.ico

# Apple Touch Icon
convert public/images/ci.png -resize 180x180 public/apple-touch-icon.png

# Android Chrome
convert public/images/ci.png -resize 192x192 public/android-chrome-192x192.png
convert public/images/ci.png -resize 512x512 public/android-chrome-512x512.png

# PWA Icons
convert public/images/ci.png -resize 192x192 public/icon-192.png
convert public/images/ci.png -resize 512x512 public/icon-512.png

# OG Image (1200x630, 중앙 배치)
convert public/images/ci.png -resize 600x600 -background white -gravity center -extent 1200x630 public/images/og-image.jpg
```

---

## 현재 작업

1. **즉시 적용 가능한 임시 파일 생성** (ci.png 복사)
2. **SEO.astro 및 관련 파일 업데이트**
3. **manifest.json (PWA) 생성**

---

## 최종 파일 구조

```
public/
├── favicon.ico
├── favicon.svg
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── icon-192.png
├── icon-512.png
├── manifest.json (PWA manifest)
└── images/
    ├── ci.png (원본)
    ├── og-image.jpg (SNS 공유용 1200x630)
    └── main-logo.png (기존)
```
