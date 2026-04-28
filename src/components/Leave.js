import React, { useEffect, useState } from 'react';
import { MdAdd, MdKeyboardArrowLeft } from 'react-icons/md';
import animationData from '../lottie/Confetti.json';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaveAPI } from '../helper.js/api';
import { IoPerson } from 'react-icons/io5';

function Leave() {
  const navigate = useNavigate();
  const [active, setActive] = useState('Total');
  const [leaveData, setLeaveData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    async function leave() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchLeaveAPI();
        setLeaveData(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    leave();
  }, []);

  const filteredData =
    active === 'Total'
      ? leaveData
      : leaveData
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
                    <h2>Leave History</h2>
                    <p>
                      Maintain a complete record of employee leave applications
                      and monitor their approval status efficiently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="permission-history">
              <h4>Leave History</h4>
            </div>

            <div className="apply-des-main desktop-only">
              <div
                className="apply-btn"
                onClick={() => navigate('/apply-leave')}
              >
                <span style={{ fontSize: '18px' }}>
                  <MdAdd />
                </span>
                <span>Apply Leave</span>
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

            {/* <div className="permission-title-group">
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: 120, height: 120 }}
              />
              <div>
                <p>No Leave Found</p>
              </div>
            </div> */}

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
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <div className="perm-clock">
                              <IoPerson
                                style={{ fontSize: '22px', color: '#241e3e' }}
                              />
                            </div>
                            <div>
                              <h4>{item.name}</h4>
                              <span className="date">ID: {item.empid}</span>
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
                            <span>Leave Date</span>
                            <strong>{item.leave_date}</strong>
                          </div>
                          <div>
                            <span>Duration</span>
                            <strong>{item.duration}</strong>
                          </div>
                          {item.half_day && (
                            <div>
                              <span>Half Day</span>
                              <strong>{item.half_day}</strong>
                            </div>
                          )}
                        </div>

                        <div className="reason">Reason : {item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="desktop-attendance-table">
                  <div className="desktop-table-header">
                    <span>Date</span>
                    <span>Duration</span>
                    <span>Half Day</span>
                    <span>Reason</span>
                    <span>Status</span>
                  </div>
                  {filteredData?.map((log, i) => (
                    <div className="desktop-table-row" key={i}>
                      <span>{log.leave_date}</span>
                      <span>{log.duration}</span>
                    <span>{log.half_day || '--'} </span>
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
                  <p>No Leave Found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="apply-mob-main mobile-only">
        <div className="apply-btn" onClick={() => navigate('/apply-leave')}>
          <span style={{ fontSize: '18px' }}>
            <MdAdd />
          </span>{' '}
          <span>Apply Leave</span>
        </div>
      </div>
    </>
  );
}

export default Leave;
