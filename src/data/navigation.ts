/**
 * 중앙 집중식 네비게이션 데이터
 * 모든 메뉴(헤더, 플로팅 네비)가 이 데이터를 사용합니다.
 */

export interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { 
    href: '/', 
    label: '홈' 
  },
  { 
    href: '/about', 
    label: '가치로운이란?', 
    children: [
      { href: '/about#values', label: '가치란' },
      { href: '/about#cooperative', label: '사회적협동조합이란' },
      { href: '/about#greeting', label: '인사말' },
      { href: '/about#cycle', label: '가치로운의 순환구조' },
      { href: '/about#vision', label: '경영철학 & 비전' },
      { href: '/about#gangnam', label: '가치로운 강남구' },
      { href: '/about#access', label: '가치로운 접근성' },
      { href: '/about#organization', label: '조직도' },
      { href: '/about#history', label: '연혁' },
      { href: '/about#location', label: '사무실 위치' },
    ]
  },
  { 
    href: '/services', 
    label: '사업소개',
    children: [
      { href: '/services#overview', label: '주요사업' },
      { href: '/services#elderly', label: '재가방문요양사업' },
      { href: '/services#disability', label: '장애인활동지원사업' },
      { href: '/services#youth', label: '아동청소년성장지원사업' },
    ]
  },
  { 
    href: '/notice', 
    label: '안내사항',
    children: [
      { href: '/notice#announcements', label: '공지사항' },
      { href: '/notice#annual-schedule', label: '연간 주요 일정' },
      { href: '/notice#events', label: '행사일정' },
      { href: '/notice#volunteer', label: '봉사활동 신청' },
      { href: '/notice#donation', label: '정기후원 신청' },
    ]
  },
  { 
    href: '/resources', 
    label: '자료실',
    children: [
      { href: '/resources#activities', label: '활동 내역' },
      { href: '/resources#downloads', label: '서식 다운로드' },
    ]
  },
];

/**
 * 특정 경로의 서브메뉴를 가져옵니다.
 */
export function getSubMenu(path: string): NavItem[] {
  const mainItem = navigation.find(item => path.startsWith(item.href) && item.href !== '/');
  return mainItem?.children || [];
}

/**
 * 페이지 경로로부터 플로팅 네비게이션 아이템을 가져옵니다.
 */
export function getFloatingNavItems(pathname: string): NavItem[] {
  const subMenu = getSubMenu(pathname);
  return subMenu;
}

/**
 * 스와이프 네비게이션을 위한 메인 섹션 목록
 */
export interface SwipeSection {
  id: string;
  name: string;
  path: string;
}

export const swipeSections: SwipeSection[] = [
  { id: 'home', name: '홈', path: '/' },
  { id: 'about', name: '가치로운이란?', path: '/about' },
  { id: 'services', name: '사업소개', path: '/services' },
  { id: 'notice', name: '안내사항', path: '/notice' },
  { id: 'resources', name: '자료실', path: '/resources' },
];
