#!/bin/bash

# ImageMagick을 사용하여 이미지 최적화
# 사용법: ./optimize-images.sh

cd "$(dirname "$0")"

echo "이미지 최적화 시작..."

# 노인복지.jpg 최적화
if [ -f "public/images/노인복지.jpg" ]; then
    echo "노인복지.jpg 최적화 중..."
    magick "public/images/노인복지.jpg" -resize '1200>' -quality 80 -strip "public/images/노인복지_temp.jpg"
    mv "public/images/노인복지_temp.jpg" "public/images/노인복지.jpg"
    echo "노인복지.jpg 완료"
fi

# 장애인지원.jpg 최적화
if [ -f "public/images/장애인지원.jpg" ]; then
    echo "장애인지원.jpg 최적화 중..."
    magick "public/images/장애인지원.jpg" -resize '1200>' -quality 80 -strip "public/images/장애인지원_temp.jpg"
    mv "public/images/장애인지원_temp.jpg" "public/images/장애인지원.jpg"
    echo "장애인지원.jpg 완료"
fi

# 청소년지원.jpg 최적화
if [ -f "public/images/청소년지원.jpg" ]; then
    echo "청소년지원.jpg 최적화 중..."
    magick "public/images/청소년지원.jpg" -resize '1200>' -quality 80 -strip "public/images/청소년지원_temp.jpg"
    mv "public/images/청소년지원_temp.jpg" "public/images/청소년지원.jpg"
    echo "청소년지원.jpg 완료"
fi

echo ""
echo "최적화 완료! 파일 크기 확인:"
ls -lh public/images/노인복지.jpg public/images/장애인지원.jpg public/images/청소년지원.jpg
