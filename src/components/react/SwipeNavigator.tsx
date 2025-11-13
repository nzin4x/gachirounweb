import { useEffect, useRef } from 'react';

interface SwipeNavigatorProps {
  sections: Array<{
    id: string;
    name: string;
    path: string;
  }>;
}

export default function SwipeNavigator({ sections }: SwipeNavigatorProps) {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const currentSectionRef = useRef<string>('');
  
  const minSwipeDistance = 50; // 최소 스와이프 거리 (px)

  useEffect(() => {
    // 현재 페이지 경로에서 섹션 추출
    const path = window.location.pathname;
    const matchedSection = sections.find(s => path.includes(s.path));
    if (matchedSection) {
      currentSectionRef.current = matchedSection.id;
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const distance = touchStartX.current - touchEndX.current;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe || isRightSwipe) {
        const currentIndex = sections.findIndex(
          s => s.id === currentSectionRef.current
        );

        let nextIndex = -1;
        if (isLeftSwipe && currentIndex < sections.length - 1) {
          // 왼쪽으로 스와이프 → 다음 섹션
          nextIndex = currentIndex + 1;
        } else if (isRightSwipe && currentIndex > 0) {
          // 오른쪽으로 스와이프 → 이전 섹션
          nextIndex = currentIndex - 1;
        }

        if (nextIndex !== -1) {
          const nextSection = sections[nextIndex];
          // 부드러운 전환을 위한 페이지 이동
          window.location.href = nextSection.path;
        }
      }

      // 초기화
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    // 모바일에서만 작동
    if (window.innerWidth <= 768) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sections]);

  return null; // UI가 없는 순수 기능 컴포넌트
}
