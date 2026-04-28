import React, { useEffect, useState } from 'react';
import { MdAdd, MdKeyboardArrowLeft } from 'react-icons/md';
import animationData from '../lottie/Ticket.json';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { IoMdPerson } from 'react-icons/io';
import { fetchRaiseTicketAPI } from '../helper.js/api';

function RaiseTicket() {
  const [active, setActive] = useState('Total');
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [ticketData, setTicketData] = useState([]);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1);
  const currentYear = now.getFullYear();

  const [dateFilter, setDateFilter] = useState({
    user_id: '',
    month: currentMonth,
    year: currentYear,
  });

  useEffect(() => {
    async function raiseTicket() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchRaiseTicketAPI(dateFilter);
        setTicketData(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    raiseTicket();
  }, [dateFilter]);

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

  const handleDate = (e) => {
    const { name, value } = e.target;

    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      ? ticketData
      : ticketData
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
            <h3 style={{ fontWeight: 600, fontSize: '16px' }}>MPeoples</h3>
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
                    <h2>Raised Ticket</h2>
                    <p>
                      Track and manage all tickets raised by you, ensuring clear
                      visibility into their status and progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="apply-des-main desktop-only">
              <div
                className="apply-btn"
                onClick={() => navigate('/apply-raiseticket')}
              >
                <span style={{ fontSize: '18px' }}>
                  <MdAdd />
                </span>
                <span>Raise Ticket</span>
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
                  {[2026, 2025, 2024, 2023].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="permission-history">
              <h4>Raised Tickets</h4>
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
                              <IoMdPerson />
                            </div>
                            <div>
                              <h4>{item.user.name}</h4>
                              <span className="date">type: {item.type}</span>
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
                            {/* <span>Start Time</span> */}
                            <strong>Date: {item.date}</strong>
                          </div>
                          <div>
                            {/* <span>End Time</span> */}
                            <strong>Time: {formatTo12Hour(item.time)}</strong>
                          </div>
                        </div>

                        <div className="reason">Reason : {item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="desktop-attendance-table">
                  <div className="desktop-table-headers">
                    <span>Emp Name</span>
                    <span>Date</span>
                    <span>CheckIn Time</span>
                    <span>CheckOut Time</span>
                    <span>Reason</span>
                    <span>Status</span>
                  </div>
                  {filteredData?.map((log, i) => (
                    <div className="desktop-table-rows" key={i}>
                      <span>{log.user.name}</span>
                      <span>{log.date}</span>
                      <span>
                        {log.type === 'clock_in'
                          ? formatTo12Hour(log.time)
                          : '--:--:--'}
                      </span>
                      <span>
                        {log.type === 'clock_out'
                          ? formatTo12Hour(log.time)
                          : '--:--:--'}
                      </span>
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
                  <p>No Ticket Found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="apply-mob-main mobile-only">
        <div
          className="apply-btn"
          onClick={() => navigate('/apply-raiseticket')}
        >
          <span style={{ fontSize: '18px' }}>
            <MdAdd />
          </span>{' '}
          <span>Raise Ticket</span>
        </div>
      </div>
    </>
  );
}

export default RaiseTicket;
