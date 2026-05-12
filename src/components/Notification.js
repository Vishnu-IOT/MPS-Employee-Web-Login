import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import animationData from '../lottie/Online Work.json';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { fetchNotificationByMonthAPI } from '../helper.js/api';

function Notification() {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [notificationData, setNotificationData] = useState([]);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1);
  const currentYear = now.getFullYear();

  const [dateFilter, setDateFilter] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const monthOptions = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - 3 + i);

  const handleDate = (e) => {
    const { name, value } = e.target;

    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    async function notifications() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchNotificationByMonthAPI(dateFilter);
        setNotificationData(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    notifications();
  }, [dateFilter]);

  const getVisited = () => {
    return JSON.parse(localStorage.getItem('visited_notifications')) || [];
  };

  const markVisited = (id) => {
    let visited = getVisited();

    if (!visited.includes(id)) {
      visited.push(id);
      localStorage.setItem('visited_notifications', JSON.stringify(visited));
    }
  };

  return (
    <>
      <div className="permission-screen">
        <div className="report-top">
          <div className="report-back">
            <button className="down-btn" onClick={() => navigate('/home')}>
              <MdKeyboardArrowLeft />
            </button>
            <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Notifications</h3>
          </div>
          <div className="permission-main">
            <div className="page-headers glass-panels">
              <div className="header-content">
                <div className="permission-title-groups">
                  <Lottie
                    animationData={animationData}
                    style={{ width: 100, height: 100 }}
                  />
                  <div>
                    <h2>Notification List</h2>
                    <p>
                      Track and manage employee late entries, ensuring better
                      visibility into attendance patterns and punctuality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                width: '100%',
                gap: '10px',
                padding: '0 0 16px',
              }}
            >
              <div className="form-groups">
                <select
                  name="month"
                  value={dateFilter.month}
                  onChange={handleDate}
                >
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-groups">
                <select
                  name="year"
                  value={dateFilter.year}
                  onChange={handleDate}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Log Items */}
            {loadingState ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Lottie
                  animationData={loading}
                  style={{ width: 100, height: 100 }}
                />
              </div>
            ) : notificationData && notificationData.length > 0 ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <div className="list">
                    {notificationData.map((item, index) => (
                      <div
                        className={`noti-card ${
                          getVisited().includes(item.id)
                            ? 'mp-read'
                            : 'mp-unread'
                        }`}
                        key={index}
                        onClick={() => {
                          markVisited(item.id);
                          setSelectedData(item);
                          setOpen(true);
                        }}
                      >
                        <div className="holi-date">{item.title}</div>

                        {/* <div className="holi-divider" /> */}

                        <div className="holi-desc">
                          {/* <span className="main-text">CheckIn-Time: </span> */}
                          {item.description}
                        </div>

                        {/* <div className="holi-divider" /> */}

                        <div className="holi-desc">
                          {/* <span className="main-text">Late-Time: </span>{' '} */}
                          {item.type} {item.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="permission-title-group">
                <Lottie
                  animationData={animationData}
                  loop={true}
                  style={{ width: 120, height: 120 }}
                />
                <div>
                  <p>No Notification Found</p>
                </div>
              </div>
            )}
          </div>

          {open && (
            <div className="mp-overlay" onClick={() => setOpen(false)}>
              <div
                className="mp-bottom-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="mp-close-btn" onClick={() => setOpen(false)}>
                  ✕
                </button>

                <div className="mp-div">
                  <h2 className="mp-title">{selectedData.title}</h2>
                  <div className="mp-div-type">
                    <span className="mp-type">{selectedData.type}</span>
                  </div>
                </div>
                <p className="mp-desc">
                  <span className="mp-main-text">Time: </span>{' '}
                  {selectedData.time}
                </p>
                <p className="mp-desc">
                  <span className="mp-main-text">Desc: </span>{' '}
                  {selectedData.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Notification;
