#!/bin/bash

# ImageMagick을 사용한 실제 리사이즈 스크립트
# 사전 요구사항: ImageMagick 설치 필요
# - macOS: brew install imagemagick
# - Ubuntu/Debian: sudo apt-get install imagemagick
# - Windows: choco install imagemagick

echo "🎨 ImageMagick을 사용한 아이콘 생성..."

# ImageMagick 설치 확인
if ! command -v convert &> /dev/null; then
  echo "❌ ImageMagick이 설치되어 있지 않습니다!"
  echo "설치 방법:"
  echo "  - macOS: brew install imagemagick"
  echo "  - Ubuntu: sudo apt-get install imagemagick"
  echo "  - Windows: choco install imagemagick"
  exit 1
fi

# 원본 확인
if [ ! -f "public/images/ci.png" ]; then
  echo "❌ public/images/ci.png 파일이 없습니다!"
  exit 1
fi

# Favicon (16x16, 32x32)
echo "📦 Favicon 생성..."
convert public/images/ci.png -resize 16x16 public/favicon-16x16.png
convert public/images/ci.png -resize 32x32 public/favicon-32x32.png
convert public/images/ci.png -resize 48x48 public/favicon-48x48.png
convert public/favicon-16x16.png public/favicon-32x32.png public/favicon-48x48.png public/favicon.ico

# Apple Touch Icon (180x180)
echo "🍎 Apple Touch Icon 생성..."
convert public/images/ci.png -resize 180x180 -background white -gravity center -extent 180x180 public/apple-touch-icon.png

# Android Chrome (192x192, 512x512)
echo "🤖 Android Chrome 아이콘 생성..."
convert public/images/ci.png -resize 192x192 -background white -gravity center -extent 192x192 public/android-chrome-192x192.png
convert public/images/ci.png -resize 512x512 -background white -gravity center -extent 512x512 public/android-chrome-512x512.png

# PWA Icons (192x192, 512x512)
echo "📱 PWA 아이콘 생성..."
convert public/images/ci.png -resize 192x192 -background white -gravity center -extent 192x192 public/icon-192.png
convert public/images/ci.png -resize 512x512 -background white -gravity center -extent 512x512 public/icon-512.png

# Maskable Icons (Safe Zone 80%, 192x192, 512x512)
echo "🎭 Maskable 아이콘 생성 (Safe Zone 적용)..."
convert public/images/ci.png -resize 154x154 -background white -gravity center -extent 192x192 public/icon-maskable-192.png
convert public/images/ci.png -resize 410x410 -background white -gravity center -extent 512x512 public/icon-maskable-512.png

# OG Image (1200x630, 중앙 배치)
echo "🖼️ Open Graph 이미지 생성..."
convert public/images/ci.png -resize 600x600 -background white -gravity center -extent 1200x630 public/images/og-image.jpg

# SVG Favicon (ci.png를 SVG로 변환, 선택사항)
# echo "🎨 SVG Favicon 생성..."
# convert public/images/ci.png -resize 512x512 public/favicon.svg

# 임시 파일 삭제
rm -f public/favicon-48x48.png

echo ""
echo "✅ 모든 아이콘 생성 완료!"
echo ""
echo "생성된 파일:"
ls -lh public/favicon.ico public/favicon-*.png public/apple-touch-icon.png public/android-chrome-*.png public/icon-*.png public/images/og-image.jpg 2>/dev/null
echo ""
echo "📌 다음 단계:"
echo "1. 생성된 파일들 확인"
echo "2. git add public/"
echo "3. git commit -m 'feat: Add favicons and PWA icons'"
echo "4. git push"
