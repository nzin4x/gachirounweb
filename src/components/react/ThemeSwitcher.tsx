import { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: 'trust-blue',
    name: '프로페셔널 블루',
    description: '신뢰와 안정을 상징하는 전문적인 테마',
    colors: {
      primary: '#1e40af',
      accent: '#0ea5e9',
    },
  },
  {
    id: 'gachiroun-original',
    name: '가치로운 오리지널',
    description: '따뜻하면서도 전문적인 소셜 케어 브랜드',
    colors: {
      primary: '#f26538',
      accent: '#f59e0b',
    },
  },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('trust-blue');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // localStorage에서 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // 기본값: trust-blue
      setCurrentTheme('trust-blue');
      document.documentElement.setAttribute('data-theme', 'trust-blue');
    }
  }, []);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('theme', themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme);

  return (
    <div className="theme-switcher">
      <button
        className="theme-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="테마 변경"
        title="테마 변경"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <span className="theme-label">테마</span>
      </button>

      {isOpen && (
        <div className="theme-switcher-dropdown">
          <div className="theme-dropdown-header">
            <h4>테마 선택</h4>
            <button
              className="theme-close"
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <div className="theme-list">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className="theme-preview">
                  <div
                    className="color-circle"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="color-circle"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                <div className="theme-info">
                  <div className="theme-name">{theme.name}</div>
                  <div className="theme-description">{theme.description}</div>
                </div>
                {currentTheme === theme.id && (
                  <div className="theme-check">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
