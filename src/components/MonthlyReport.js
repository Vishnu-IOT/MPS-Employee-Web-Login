import Lottie from 'lottie-react';
import React, { useEffect, useState } from 'react';
import { IoMdDownload } from 'react-icons/io';
import animationData from '../lottie/Completing Tasks.json';
import loading from '../lottie/loading.json';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchAttendanceByMonthAPI } from '../helper.js/api';
import PdfReport from './PdfReport';
import { IoCalendarOutline } from 'react-icons/io5';

function MonthlyReport() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [daysData, setDaysData] = useState();
  const [loadingState, setLoadingState] = useState(false);
  const [active, setActive] = useState('Total');

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
    async function monthlyReport() {
      setLoadingState(true); // start loading

      try {
        const data = await fetchAttendanceByMonthAPI(dateFilter);
        setAttendanceData(
          Array.isArray(data?.data.attendance) ? data.data.attendance : []
        );
        setDaysData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }

    monthlyReport();
  }, [dateFilter]);

  const isValidTime = (time) => {
    return (
      time && time !== '--:--' && time !== '-:--:--' && time !== '--:--:--'
    );
  };

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!isValidTime(checkIn) || !isValidTime(checkOut)) {
      return '-:--:--';
    }

    const inTime = new Date(`1970-01-01T${checkIn}`);
    const outTime = new Date(`1970-01-01T${checkOut}`);

    if (isNaN(inTime) || isNaN(outTime)) return '--:--';

    const diffMs = outTime - inTime;

    if (diffMs <= 0) return '--:--';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
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

  // const reversedData = [...attendanceData].reverse();

  const reversedData = [
    ...(active === 'Total'
      ? attendanceData
      : active.toLowerCase() === 'leave'
        ? attendanceData.filter((item) =>
            ['casual', 'lop', 'sick'].includes(item.type?.toLowerCase())
          )
        : active.toLowerCase() === 'holiday'
          ? attendanceData.filter((item) =>
              ['w-h', 'c-h', 'l-h'].includes(item.type?.toLowerCase())
            )
          : active.toLowerCase() === 'present'
            ? attendanceData.filter((item) =>
                ['present', 'onduty'].includes(item.type?.toLowerCase())
              )
            : attendanceData.filter(
                (item) => item.type?.toLowerCase() === active.toLowerCase()
              )),
  ].reverse();

  const attendanceLabels = {
    PRESENT: {
      label: 'PRESENT',
      bg: '#dcfce7',
      text: '#15803d',
    },

    ABSENT: {
      label: 'ABSENT',
      bg: '#fee2e2',
      text: '#dc2626',
    },

    HALFDAY: {
      label: 'Half Day',
      bg: '#fef3c7',
      text: '#d97706',
    },

    LEAVE: {
      label: 'Leave',
      bg: '#ede9fe',
      text: '#7c3aed',
    },

    SICK: {
      label: 'Sick Leave',
      bg: '#dbeafe',
      text: '#2563eb',
    },

    CASUAL: {
      label: 'Casual Leave',
      bg: '#fce7f3',
      text: '#db2777',
    },

    LOP: {
      label: 'Loss of Pay',
      bg: '#fecaca',
      text: '#b91c1c',
    },

    ONDUTY: {
      label: 'On Duty',
      bg: '#cffafe',
      text: '#0891b2',
    },

    'L-H': {
      label: 'Local Holiday',
      bg: '#e0f2fe',
      text: '#0369a1',
    },

    'C-H': {
      label: 'Casual Holiday',
      bg: '#fae8ff',
      text: '#a21caf',
    },

    'W-H': {
      label: 'Weekend Holiday',
      bg: '#e5e7eb',
      text: '#4b5563',
    },
  };

  return (
    <div className="report-screen">
      <div className="mr-report-fixed">
        <div className="report-top">
          <div className="report-back">
            <button className="down-btn" onClick={() => navigate('/home')}>
              <MdKeyboardArrowLeft />
            </button>
            <h3 style={{ fontWeight: 600, fontSize: '16px' }}>
              Monthly Report
            </h3>
          </div>
          <div className="page-headers glass-panels">
            <div className="header-content">
              <div className="permission-title-groups">
                <Lottie
                  animationData={animationData}
                  style={{ width: 100, height: 100 }}
                />
                <div>
                  <h2>Monthly Report</h2>
                  <p>
                    Track and analyze monthly reports, ensuring clear insights
                    into employee performance and attendance across your
                    organization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mr-form-group">
          <div className="form-groups mr-form">
            <select name="month" value={dateFilter.month} onChange={handleDate}>
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-groups mr-form">
            <select name="year" value={dateFilter.year} onChange={handleDate}>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="form-groups mr-form">
            <button
              className="excel-btn"
              onClick={() => {
                if (attendanceData.length > 0) {
                  PdfReport(attendanceData);
                } else {
                  alert('No data to download');
                }
              }}
            >
              <IoMdDownload />
            </button>
          </div>

          <div className="form-groups mr-form">
            <button
              className="excel-btn"
              onClick={() => {
                navigate('/month-overview');
                // alert('Calendar feature is coming soon 🚀');
              }}
            >
              <IoCalendarOutline />
            </button>
          </div>
        </div>

        {/* <h3 style={{ padding: '0 16px', fontWeight: 800 }}>Attendance Overview</h3> */}

        {/* Attendance Status */}
        <div className="mr-checkin-main">
          <div className="mr-stats-grid">
            <div className="mr-stat-cell">
              <div className="mr-stat-label">Total Days</div>
              <div className="mr-stat-value">{daysData?.total_days}</div>
            </div>
            <div className="mr-stat-cell">
              <div className="mr-stat-label">Holidays</div>
              <div className="mr-stat-value"> {daysData?.total_holidays}</div>
            </div>
            <div className="mr-stat-cell">
              <div className="mr-stat-label">Working Days</div>
              <div className="mr-stat-value"> {daysData?.working_days}</div>
            </div>
            <div className="mr-stat-cell">
              <div className="mr-stat-label">Present</div>
              <div className="mr-stat-value"> {daysData?.present_days}</div>
            </div>
            <div className="mr-stat-cell">
              <div className="mr-stat-label">Absent</div>
              <div className="mr-stat-value"> {daysData?.absent_days}</div>
            </div>
            <div className="mr-stat-cell">
              <div className="mr-stat-label">Leave</div>
              <div className="mr-stat-value"> {daysData?.leave_days}</div>
            </div>
          </div>
        </div>
        <div className="mr-page-tabs">
          {['Total', 'Present', 'Absent', 'Leave', 'Holiday'].map((tab) => (
            <button
              key={tab}
              className={`page-tab ${active === tab ? 'active' : ''}`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="desktop-attendance-table">
        <div className="desktop-table-header">
          <span>Date</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Work Hours</span>
          <span>Status</span>
        </div>
        {reversedData?.map((log, i) => (
          <div
            className="desktop-table-row"
            key={i}
            onClick={() =>
              navigate('/attendance-details', { state: { data: log.date } })
            }
            style={{ cursor: 'pointer' }}
          >
            <span>{log.date}</span>
            <span>{formatTo12Hour(log.check_in)}</span>
            <span>{formatTo12Hour(log.check_out)}</span>
            <span>{calculateWorkHours(log.check_in, log.check_out)}</span>
            <span>
              <div
                className={`badge ${
                  log.late_checkin
                    ? 'lates'
                    : log.type === 'PRESENT'
                      ? 'presents'
                      : 'absents'
                }`}
                // style={{ background: attendanceLabels[log.type].text }}
              >
                {log.late_checkin
                  ? `Late ${log.late_checkin_time}`
                  : attendanceLabels[log.type].label}
              </div>
            </span>
          </div>
        ))}
      </div>

      {/* Log Items */}
      <div
        className="mr-log-card"
        style={{
          display: 'flex',
          gap: '10px',
          padding: '16px',
          flexDirection: 'column',
        }}
      >
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
        ) : reversedData && reversedData.length > 0 ? (
          reversedData?.map((log, i) => (
            <div
              className="attendance-log-item"
              key={i}
              onClick={() =>
                navigate('/attendance-details', { state: { data: log.date } })
              }
              style={{ cursor: 'pointer' }}
            >
              <div className="log-date-row">
                <span>{log.date}</span>
                <div
                  className={`badge ${
                    log.late_checkin
                      ? 'lates'
                      : log.type === 'PRESENT'
                        ? 'presents'
                        : 'absents'
                  }`}
                >
                  {log.late_checkin
                    ? `Late ${log.late_checkin_time}`
                    : attendanceLabels[log.type].label}
                </div>
              </div>
              <div className="log-times">
                <div className="log-time-col">
                  <span>Check in</span>
                  <strong>{formatTo12Hour(log.check_in)}</strong>
                </div>
                <div className="log-time-col">
                  <span>Check out</span>
                  <strong>{formatTo12Hour(log.check_out)}</strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="permission-title-group">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: 120, height: 120 }}
            />
            <div>
              <p>No Report Found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyReport;
