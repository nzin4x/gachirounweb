import { useState, useEffect } from 'react';
import './CommandPalette.css';

interface CommandPaletteProps {
  onRefreshData?: () => void;
  onToggleDataPaths?: () => void;
  onToggleLiveUpdates?: () => void;
}

export default function CommandPalette({ onRefreshData, onToggleDataPaths, onToggleLiveUpdates }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [liveUpdatesState, setLiveUpdatesState] = useState(false);
  const [dataPathsState, setDataPathsState] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+P or Cmd+Shift+P
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'live-update-status-changed') {
        setLiveUpdatesState(e.data.enabled);
      } else if (e.data?.type === 'data-paths-status-changed') {
        setDataPathsState(e.data.enabled);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen]);

  // Mobile: double-tap footer logo to open
  useEffect(() => {
    const footerLogo = document.querySelector('footer .footer-logo');
    if (!footerLogo) return;

    let lastTap = 0;
    const handleDoubleTap = (e: Event) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTap;
      
      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      lastTap = now;
    };

    footerLogo.addEventListener('click', handleDoubleTap);
    return () => footerLogo.removeEventListener('click', handleDoubleTap);
  }, []);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'refresh-data',
      label: '📥 데이터 재조회',
      description: '현재 페이지의 라이브 데이터를 새로고침 없이 다시 가져옵니다',
      action: () => {
        // Send appropriate message based on current page
        const currentPath = window.location.pathname;
        if (currentPath.includes('/about')) {
          window.postMessage({ type: 'refetch-greeting' }, '*');
        } else if (currentPath.includes('/notice')) {
          window.postMessage({ type: 'refetch-announcements' }, '*');
        }
        onRefreshData?.();
        setIsOpen(false);
      },
    },
    {
      id: 'show-data-paths',
      label: dataPathsState ? '📍 데이터 위치 끄기' : '📍 데이터 위치 보기',
      description: dataPathsState ? '화면에 표시된 데이터 위치 라벨을 숨깁니다' : 'Strapi에서 수정할 위치를 화면에 표시합니다',
      action: () => {
        window.postMessage({ type: 'toggle-data-paths' }, '*');
        onToggleDataPaths?.();
        setIsOpen(false);
      },
    },
    {
      id: 'toggle-live-updates',
      label: liveUpdatesState ? '🔴 실시간 업데이트 끄기' : '🟢 실시간 업데이트 켜기',
      description: '데이터 변경 시 자동으로 화면을 업데이트합니다',
      action: () => {
        window.postMessage({ type: 'toggle-live-updates' }, '*');
        onToggleLiveUpdates?.();
        setIsOpen(false);
      },
    },
    {
      id: 'clear-popup-cookies',
      label: '🍪 팝업 쿠키 초기화',
      description: '모든 "오늘 하루 보지 않기" 설정을 초기화하여 팝업을 다시 볼 수 있습니다',
      action: () => {
        // localStorage에서 hidePopup_ 시작하는 모든 항목 삭제
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('hidePopup_')) {
            localStorage.removeItem(key);
          }
        });
        
        // 쿠키에서 hidePopup_ 시작하는 모든 항목 삭제
        document.cookie.split(';').forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          if (cookieName.startsWith('hidePopup_')) {
            document.cookie = `${cookieName}=; path=/; max-age=0`;
            document.cookie = `${cookieName}=; path=/; domain=.gachiroun.or.kr; max-age=0`;
          }
        });
        
        alert('팝업 쿠키가 초기화되었습니다. 페이지를 새로고침하면 팝업이 다시 표시됩니다.');
        setIsOpen(false);
      },
    },
  ];

  return (
    <>
      <div className="command-palette-overlay" onClick={() => setIsOpen(false)} />
      <div className="command-palette">
        <div className="command-palette-header">
          <input
            type="text"
            placeholder="명령 검색..."
            className="command-palette-search"
            autoFocus
          />
          <button 
            className="command-palette-close"
            onClick={() => setIsOpen(false)}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="command-palette-list">
          {commands.map(cmd => (
            <button
              key={cmd.id}
              className="command-palette-item"
              onClick={cmd.action}
            >
              <div className="command-item-label">{cmd.label}</div>
              <div className="command-item-description">{cmd.description}</div>
            </button>
          ))}
        </div>
        <div className="command-palette-footer">
          <span className="command-palette-hint">
            💡 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> 또는 푸터 로고 더블탭으로 열기
          </span>
        </div>
      </div>
    </>
  );
}
