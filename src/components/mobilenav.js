import React, { useEffect, useState } from 'react';
import { fetchProfileAPI } from '../helper.js/api';

function MobileNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function profile() {
      const data = await fetchProfileAPI();
      setUser(data);
    }
    profile();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="home-header">
        <div className="home-top-row">
          <div className="user-greeting">
            <h3>{user?.user.name}</h3>
            <p>{user?.user.position}</p>
          </div>
          <div className="user-avatar-placeholder">
            <img
              style={{ height: '100%' }}
              src={user?.user.profile_image}
              alt={user?.user.name}
            />
          </div>
        </div>
        <p className="tagline">Let's be productive today!</p>
        <div className="doc-icon">
          <svg
            width="100"
            height="60"
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* <!-- Back card --> */}
            <g transform="rotate(-12 40 40)">
              <rect
                x="10"
                y="10"
                width="50"
                height="60"
                // rx="6"
                fill="#e5e7eb"
              />
              <rect
                x="18"
                y="20"
                width="34"
                height="3"
                // rx="1.5"
                fill="#60a5fa"
              />
              <rect
                x="18"
                y="28"
                width="30"
                height="3"
                // rx="1.5"
                fill="#93c5fd"
              />
              <rect
                x="18"
                y="36"
                width="32"
                height="3"
                // rx="1.5"
                fill="#93c5fd"
              />
            </g>

            {/* <!-- Front card --> */}
            <g transform="rotate(12 80 40)">
              <rect
                x="60"
                y="10"
                width="50"
                height="60"
                // rx="6"
                fill="#f3f4f6"
              />
              <rect
                x="68"
                y="20"
                width="34"
                height="3"
                // rx="1.5"
                fill="#3b82f6"
              />
              <rect
                x="68"
                y="28"
                width="30"
                height="3"
                // rx="1.5"
                fill="#60a5fa"
              />
              <rect
                x="68"
                y="36"
                width="32"
                height="3"
                // rx="1.5"
                fill="#60a5fa"
              />
            </g>

            {/* <!-- Middle card --> */}
            <g transform="rotate(0 60 40)">
              <rect x="35" y="8" width="50" height="60" fill="#ffffff" />
              <rect
                x="43"
                y="18"
                width="34"
                height="3"
                // rx="1.5"
                fill="#60a5fa"
              />
              <rect
                x="43"
                y="26"
                width="30"
                height="3"
                // rx="1.5"
                fill="#93c5fd"
              />
              <rect
                x="43"
                y="34"
                width="32"
                height="3"
                // rx="1.5"
                fill="#93c5fd"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
