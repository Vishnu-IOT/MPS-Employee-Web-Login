// ===== SIDEBAR =====
import React, { useState } from 'react';
import { BsPerson, BsSuitcase, BsSuitcase2 } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { IoCalendarOutline, IoHomeOutline, IoNotificationsOutline } from 'react-icons/io5';
import { LuTicketCheck } from 'react-icons/lu';
import { PiScroll } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Sidebar({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  const items = [
    { label: 'Home', tab: '/home', icon: <IoHomeOutline /> },
    { label: 'Attendance', tab: '/attendance', icon: <IoCalendarOutline /> },
    {
      label: 'Monthly Report',
      tab: '/report',
      icon: <HiOutlineDocumentReport />,
    },
    { label: 'Permission', tab: '/permission', icon: <BsPerson /> },
    { label: 'Leave', tab: '/leave', icon: <BsSuitcase2 /> },
    { label: 'Raise Ticket', tab: '/ticket', icon: <LuTicketCheck /> },
    { label: 'Holidays', tab: '/holiday', icon: <BsSuitcase /> },
    { label: 'Late Days', tab: '/late', icon: <PiScroll /> },
    { label: 'Notifications', tab: '/notification', icon: <IoNotificationsOutline /> },
    { label: 'Profile', tab: '/profile', icon: <BsPerson /> },
  ];
  return (
    <div className="desktop-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-box">
          <img src={logo} alt="logo" />
        </div>
        <span>MPeoples</span>
      </div>
      {items.map((item) => (
        <div
          key={item.tab}
          className={`sidebar-nav-item ${location.pathname === item.tab ? 'active' : ''}`}
          onClick={() => navigate(item.tab)}
        >
          {item.icon}
          {item.label}
        </div>
      ))}
      <div className="sidebar-logout" onClick={() => setOpenLogout(true)}>
        <span>
          <FiLogOut />
        </span>
        <span>Logout</span>
      </div>

      {openLogout && (
        <div
          className="dialog-overlay"
          style={{ color: 'black', zIndex: '9999' }}
          onClick={() => setOpenLogout(false)}
        >
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">Logout</h2>
            <div className="dialog-content">
              <div className="dialog-row">
                <span className="icon">🕒</span>
                <span>Are you sure want to Logout?</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="submit-btn"
                style={{ background: 'var(--red)' }}
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="submit-btn"
                onClick={() => setOpenLogout(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
