#!/bin/bash

# ci.png를 기반으로 임시 아이콘 파일들 생성
# 실제로는 적절한 크기로 리사이즈해야 하지만, 일단 복사로 진행

echo "🎨 CI 이미지 기반 아이콘 생성 중..."

# 원본 확인
if [ ! -f "public/images/ci.png" ]; then
  echo "❌ public/images/ci.png 파일이 없습니다!"
  exit 1
fi

# 임시로 ci.png를 다양한 이름으로 복사
# 실제로는 ImageMagick, Sharp 등으로 리사이즈 필요

echo "📦 Favicon 파일 생성..."
cp public/images/ci.png public/favicon-16x16.png
cp public/images/ci.png public/favicon-32x32.png

echo "🍎 Apple Touch Icon 생성..."
cp public/images/ci.png public/apple-touch-icon.png

echo "🤖 Android Chrome 아이콘 생성..."
cp public/images/ci.png public/android-chrome-192x192.png
cp public/images/ci.png public/android-chrome-512x512.png

echo "📱 PWA 아이콘 생성..."
cp public/images/ci.png public/icon-192.png
cp public/images/ci.png public/icon-512.png
cp public/images/ci.png public/icon-maskable-192.png
cp public/images/ci.png public/icon-maskable-512.png

echo "🖼️ OG 이미지 생성..."
cp public/images/ci.png public/images/og-image.jpg

echo ""
echo "✅ 임시 아이콘 파일 생성 완료!"
echo ""
echo "⚠️  주의: 현재는 임시로 복사만 했습니다."
echo "📌 실제 배포 전에 다음을 수행하세요:"
echo ""
echo "1. 온라인 도구 사용 (권장):"
echo "   - https://realfavicongenerator.net/"
echo "   - ci.png 업로드 → 모든 아이콘 자동 생성"
echo ""
echo "2. 또는 ImageMagick 설치 후:"
echo "   bash generate-icons-imagemagick.sh"
echo ""
echo "생성된 파일 목록:"
ls -lh public/favicon-*.png public/apple-touch-icon.png public/android-chrome-*.png public/icon-*.png 2>/dev/null
