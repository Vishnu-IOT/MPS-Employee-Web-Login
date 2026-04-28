import React, { useEffect, useState } from 'react';
import { MdAdd, MdKeyboardArrowLeft } from 'react-icons/md';
import animationData from '../lottie/Allow Permission.json';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import '../styles/permission.css';
import { fetchPermisionAPI } from '../helper.js/api';
import { FaStopwatch } from 'react-icons/fa6';

function Permission() {
  const navigate = useNavigate();
  const [permissionData, setPermissionData] = useState([]);
  const [active, setActive] = useState('Total');
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    async function permission() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchPermisionAPI();
        setPermissionData(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    permission();
  }, []);

  // const now = new Date();
  // const currentMonth = String(now.getMonth() + 1);
  // const currentYear = now.getFullYear();

  // const [dateFilter, setDateFilter] = useState({
  //   month: currentMonth,
  //   year: currentYear,
  // });

  const formatTo12Hour = (timeStr) => {
    if (!timeStr || timeStr === '-:--:--') return '-:--:--';

    const date = new Date(`1970-01-01T${timeStr}`);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // ✅ include seconds
      hour12: true,
    });
  };

  const filteredData =
    active === 'Total'
      ? permissionData
      : permissionData
          ?.reverse()
          .filter(
            (item) => item.status?.toLowerCase() === active.toLowerCase()
          );

  return (
    <>
      <div className="permission-screen">
        <div className="report-top">
          <div className="report-back">
            <button className="down-btn" onClick={() => navigate('/home')}>
              <MdKeyboardArrowLeft />
            </button>
            <h3 style={{ fontWeight: 600, fontSize:'16px' }}>MPeoples</h3>
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
                    <h2>Permission History</h2>
                    <p>
                      Manage employee permission requests efficiently and
                      monitor their approval status in one centralized place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="permission-history">
              <h4>Permission History</h4>
            </div>
            <div className="apply-des-main desktop-only">
              <div
                className="apply-btn"
                onClick={() => navigate('/apply-permission')}
              >
                <span style={{ fontSize: '18px' }}>
                  <MdAdd />
                </span>
                <span>Apply Permission</span>
              </div>
            </div>
            <div className="page-tabs">
              {['Total', 'Approved', 'Rejected', 'Pending'].map((tab) => (
                <button
                  key={tab}
                  className={`page-tab ${active === tab ? 'active' : ''}`}
                  onClick={() => setActive(tab)}
                >
                  {tab}
                </button>
              ))}
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
            ) : filteredData && filteredData.length > 0 ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <div className="perm-list">
                    {filteredData?.map((item) => (
                      <div key={item.id} className="perm-card">
                        <div className="perm-top">
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="perm-clock">
                              <FaStopwatch />
                            </div>
                            <div>
                              <h4>Permission</h4>
                              <span className="date">
                                {item.attendance_date}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`status ${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="perm-time">
                          <div>
                            <span>Start Time</span>
                            <strong>{item.start_time}</strong>
                          </div>
                          <div>
                            <span>End Time</span>
                            <strong>{item.end_time}</strong>
                          </div>
                          <div>
                            <span>Hours</span>
                            <strong>{item.permission_hours}</strong>
                          </div>
                        </div>

                        <div className="reason">Reason : {item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="desktop-attendance-table">
                  <div className="desktop-table-headers">
                    <span>Date</span>
                    <span>Start Time</span>
                    <span>End Time</span>
                    <span>Permission Hours</span>
                    <span>Reason</span>
                    <span>Status</span>
                  </div>
                  {filteredData?.map((log, i) => (
                    <div className="desktop-table-rows" key={i}>
                      <span>{log.attendance_date}</span>
                      <span>{formatTo12Hour(log.start_time)}</span>
                      <span>{formatTo12Hour(log.end_time)}</span>
                      <span>{log.permission_hours}</span>
                      <span>{log.reason}</span>
                      <span>
                        <div
                          className={`badge ${
                            log.status === 'pending'
                              ? 'late'
                              : log.status === 'approved'
                                ? 'PRESENT'
                                : 'ABSENT'
                          }`}
                        >
                          {log.status}
                        </div>
                      </span>
                    </div>
                  ))}
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
                  <p>No Permission Found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="apply-mob-main mobile-only">
        <div
          className="apply-btn"
          onClick={() => navigate('/apply-permission')}
        >
          <span style={{ fontSize: '18px' }}>
            <MdAdd />
          </span>{' '}
          <span>Apply Permission</span>
        </div>
      </div>
    </>
  );
}

export default Permission;
