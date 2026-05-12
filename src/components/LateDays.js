import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import animationData from '../lottie/Online Work.json';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { fetchLateDaysAPI } from '../helper.js/api';

function LateDays() {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [lateDaysData, setLateDaysData] = useState([]);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1);
  const currentYear = now.getFullYear();

  const [dateFilter, setDateFilter] = useState({
    user_id: '',
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
    async function holidays() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchLateDaysAPI(dateFilter);
        setLateDaysData(
          Array.isArray(data?.data.late_list) ? data.data.late_list : []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    holidays();
  }, [dateFilter]);

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
                    <h2>Late Days List</h2>
                    <p>
                      Track and manage employee late entries, ensuring better
                      visibility into attendance patterns and punctuality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="permission-history">
              <h4>Late Days List</h4>
            </div>

            <div
              style={{
                display: 'flex',
                width: '100%',
                gap: '10px',
                padding: '16px 0',
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
            ) : lateDaysData && lateDaysData.length > 0 ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <div className="list">
                    {lateDaysData.map((item, index) => (
                      <div className="holi-card" key={index}>
                        <div className="holi-date">{item.date}</div>

                        <div className="holi-divider" />

                        <div className="holi-desc">
                           <span className='main-text'>CheckIn-Time: </span>{item.check_in}
                        </div>

                        <div className="holi-divider" />

                        <div className="holi-desc">
                          <span className='main-text'>Late-Time: </span> {item.late_checkin_time}
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
                  <p>No Late Days Found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LateDays;
