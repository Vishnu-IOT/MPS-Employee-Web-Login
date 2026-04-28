import { useEffect, useState } from 'react';
import '../styles/home.css';
import { FaRegUserCircle } from 'react-icons/fa';
import MobileNav from './mobilenav';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { fetchHomePageAPI } from '../helper.js/api';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { BsSuitcase, BsSuitcase2 } from 'react-icons/bs';
import { LuTicketCheck } from 'react-icons/lu';
import { PiScroll } from 'react-icons/pi';

// ===== HOME SCREEN =====
export const HomeScreen = () => {
  const [time, setTime] = useState(new Date());
  const [homeData, setHomeData] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function home() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchHomePageAPI();
        setHomeData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    home();
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  const fmtDate = (d) =>
    d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatTo12Hour = (timeStr) => {
    if (!timeStr || timeStr === '-:--:--' || timeStr === '--:--:--'|| timeStr === '--:--')
      return '--:--:--';

    const date = new Date(`1970-01-01T${timeStr}`);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // ✅ include seconds
      hour12: true,
    });
  };

  const exploreview = [
    {
      label: 'Monthly\nReport',
      bg: 'bg-blue',
      icon: <HiOutlineDocumentReport />,
      navi: '/report',
    },
    {
      label: 'Permission',
      bg: 'bg-teal',
      icon: <FaRegUserCircle />,
      navi: '/permission',
    },
    {
      label: 'Leave',
      bg: 'bg-orange',
      icon: <BsSuitcase2 />,
      navi: '/leave',
    },
    {
      label: 'Raise Ticket',
      bg: 'bg-green',
      icon: <LuTicketCheck />,
      navi: '/ticket',
    },
    {
      label: 'Holidays',
      bg: 'bg-gray',
      icon: <BsSuitcase />,
      navi: '/holiday',
    },
    {
      label: 'Late\nDays',
      bg: 'bg-red',
      icon: <PiScroll />,
      navi: '/late',
    },
  ];

  return (
    <>
      <MobileNav />
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
      <div className="home-screen">
        {/* Check In Card */}
        <div className="section-title" style={{ padding: '8px 16px 0' }}>
          Today's Overview
        </div>
        <div className="home-main" style={{ padding: '16px' }}>
          <div className="checkin-main">
            <div className="home-title">
              <div className="overview-top">
                <span className="overview-date">{fmtDate(time)}</span>
                <div className="live-badge">
                  <div className="live-dot" />
                  {fmt(time)}
                </div>
              </div>

              <div className="checkinout-row">
                <div className="checkinout-col">
                  <span>Check In</span>
                  <strong>
                    {formatTo12Hour(homeData?.attendance?.check_in?.time)}
                  </strong>
                </div>
                <div className="checkinout-divider" />
                <div className="checkinout-col">
                  <span>Check Out</span>
                  <strong>
                    {formatTo12Hour(homeData?.attendance?.check_out?.time)}
                  </strong>
                </div>
              </div>

              <div className="status-row">
                <span>Attendance Status</span>
                <div
                  className={`badge-status ${
                    homeData?.attendance?.type === 'PRESENT'
                      ? 'badge-present'
                      : 'badge-absent'
                  }`}
                >
                  {homeData?.attendance?.type === 'PRESENT'
                    ? 'PRESENT'
                    : 'ABSENT'}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Status */}
          <div className="checkin-main">
            <div className="stats-grid">
              <div className="stat-cell">
                <div className="stat-label">
                  <span className="dot-green">●</span> Present
                </div>
                <div className="stat-value">
                  {homeData?.attendance?.totals?.total_present}
                </div>
              </div>
              <div className="stat-cell">
                <div className="stat-label">
                  <span className="dot-red">●</span> Absent
                </div>
                <div className="stat-value">
                  {' '}
                  {homeData?.attendance?.totals?.total_absent}
                </div>
              </div>
              <div className="stat-cell">
                <div className="stat-label">
                  <span className="dot-orange">●</span> Permission
                </div>
                <div className="stat-value">
                  {' '}
                  {homeData?.attendance?.totals?.total_permission}
                </div>
              </div>
              <div className="stat-cell">
                <div className="stat-label">
                  <span className="dot-orange">●</span> Late hrs
                </div>
                <div className="stat-value">
                  {' '}
                  {homeData?.attendance?.totals?.total_late_hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="home-content">
          {/* Today's Worklog */}
          <div className="section-title">Today's Worklog</div>
          <div className="worklog-card">
            <div className="worklog-grid">
              {[
                {
                  label: 'Break-In',
                  val: formatTo12Hour(homeData?.attendance?.break_in),
                  dot: 'dot-orange',
                },
                {
                  label: 'Break-Out',
                  val: formatTo12Hour(homeData?.attendance?.break_out),
                  dot: 'dot-orange',
                },
                {
                  label: 'WorkHours',
                  val: homeData?.attendance?.worked_hours,
                  dot: 'dot-orange',
                },
                {
                  label: 'Remaining Hours',
                  val: homeData?.attendance?.remaining_hours,
                  dot: 'dot-orange',
                },
              ].map((item, i) => (
                <div className="worklog-cell" key={i}>
                  <span>
                    <span className={item.dot}>●</span> {item.label}
                  </span>
                  <strong>{item.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Explore View */}
        <div className="explore-content">
          <div className="section-title">Explore View</div>
          <div className="explore-grid">
            {exploreview.map((item, i) => (
              <div
                className="explore-item"
                key={i}
                onClick={() => navigate(item.navi)}
              >
                <div className={`explore-icon ${item.bg}`}>{item.icon}</div>
                <span style={{ whiteSpace: 'pre-line' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom nav — hidden on desktop via CSS */}
      <BottomNav />
    </>
  );
};
