import React, { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMdHome } from 'react-icons/io';
import { MdWork } from 'react-icons/md';
import { RiMessage2Fill } from 'react-icons/ri';
import BottomNav from './BottomNav';
import { fetchProfileAPI } from '../helper.js/api';
import Lottie from 'lottie-react';
import loading from '../lottie/loading.json';
import { useNavigate } from 'react-router-dom';

function ProfileScreen({ setUser }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  useEffect(() => {
    async function profile() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchProfileAPI();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    profile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const basicdetails = [
    { icon: <RiMessage2Fill />, text: users?.user.email },
    { icon: <FaPhoneAlt />, text: users?.user.mobile },
    { icon: <IoMdHome />, text: users?.user.address },
    { icon: <MdWork />, text: users?.user.company_name },
  ];

  return (
    <>
      {loadingState && (
        <div className="lottie-overlay">
          <Lottie
            animationData={loading}
            style={{
              width: 100,
              height: 100,
              border: '1px solid transparent',
              background: 'white',
              borderRadius: '10px',
            }}
          />
        </div>
      )}
      <div className="profile-screen">
        <div>
          <div className="profile-header">
            <h2>Profile</h2>
          </div>

          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <img
                style={{ height: '100%' }}
                src={users?.user.profile_image}
                alt={users?.user.name}
              />
            </div>
          </div>

          <div className="profile-name">{users?.user.name}</div>
          <div className="profile-role">{users?.user.position}</div>
          <div className="profile-id">{users?.user.empid}</div>
        </div>

        <div className="section-label">BASIC DETAILS</div>
        <div className="info-card">
          {basicdetails.map((row, i) => (
            <div className="info-row" key={i}>
              <div className="info-icon">{row.icon}</div>
              <span>{row.text}</span>
            </div>
          ))}
        </div>

        <div className="section-label">SETTINGS</div>
        <div className="info-card">
          <div
            className="info-row"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/change-password')}
          >
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <span>Change Password</span>
          </div>
          <div
            className="info-row"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenLogout(true)}
          >
            <div className="info-icon">
              <IoMdHome />
            </div>
            <span>Logout</span>
          </div>
        </div>

        {openLogout && (
          <div className="dialog-overlay" onClick={() => setOpenLogout(false)}>
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

        {/* Bottom nav — hidden on desktop via CSS */}
        <BottomNav />
      </div>
    </>
  );
}

export default ProfileScreen;
