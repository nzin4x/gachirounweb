#!/bin/bash

echo "======================================"
echo "가치로운 홈페이지 URL 전체 점검"
echo "======================================"
echo ""

BASE_URL="http://localhost:4321"

# 색상 코드
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_url() {
    local url=$1
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓${NC} $url - Status: $status"
        return 0
    else
        echo -e "${RED}✗${NC} $url - Status: $status"
        return 1
    fi
}

echo "메인 페이지"
echo "----------------------------------------"
check_url "/"
echo ""

echo "소개 페이지"
echo "----------------------------------------"
check_url "/about"
check_url "/about/history"
check_url "/about/location"
check_url "/about/organization"
echo ""

echo "서비스 페이지"
echo "----------------------------------------"
check_url "/services"
check_url "/services/elderly"
check_url "/services/disability"
check_url "/services/youth"
echo ""

echo "기타 페이지"
echo "----------------------------------------"
check_url "/notice"
check_url "/recruit"
check_url "/privacy"
check_url "/terms"
echo ""

echo "======================================"
echo "점검 완료"
echo "======================================"
