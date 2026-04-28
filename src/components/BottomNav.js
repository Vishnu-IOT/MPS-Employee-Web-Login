import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ===== ICONS =====
const HomeIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const UserIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
        onClick={() => navigate('/home')}
      >
        <HomeIcon />
        {location.pathname === '/home' && <div className="nav-dot" />}
      </div>
      <div
        className={`nav-item ${location.pathname === '/attendance' ? 'active' : ''}`}
        onClick={() => navigate('/attendance')}
      >
        <CalendarIcon />
        {location.pathname === '/attendance' && <div className="nav-dot" />}
      </div>
      <div
        className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <UserIcon />
        {location.pathname === '/profile' && <div className="nav-dot" />}
      </div>
    </div>
  );
}

export default BottomNav;
