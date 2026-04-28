import Lottie from 'lottie-react';
import React, { useEffect, useState } from 'react';
import { IoMdDownload } from 'react-icons/io';
import animationData from '../lottie/Completing Tasks.json';
import loading from '../lottie/loading.json';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchAttendanceByMonthAPI } from '../helper.js/api';
import PdfReport from './PdfReport';

function MonthlyReport() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

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

  const handleDate = (e) => {
    const { name, value } = e.target;

    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const reversedData = [...attendanceData].reverse();

  useEffect(() => {
    async function monthlyReport() {
      setLoadingState(true); // start loading

      try {
        const data = await fetchAttendanceByMonthAPI(dateFilter);
        setAttendanceData(
          Array.isArray(data?.data.attendance) ? data.data.attendance : []
        );
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

  return (
    <div className="report-screen">
      <div className="report-top">
        <div className="report-back">
          <button className="down-btn" onClick={() => navigate('/home')}>
            <MdKeyboardArrowLeft />
          </button>
          <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Monthly Report</h3>
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
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: '10px',
          padding: '8px 16px',
        }}
      >
        <div className="form-groups">
          <select name="month" value={dateFilter.month} onChange={handleDate}>
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-groups">
          <select name="year" value={dateFilter.year} onChange={handleDate}>
            {[2026, 2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="form-groups">
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
      </div>
      {/* <h3 style={{ padding: '0 16px', fontWeight: 800 }}>Attendance Overview</h3> */}

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
              >
                {log.late_checkin ? `Late ${log.late_checkin_time}` : log.type}
              </div>
            </span>
          </div>
        ))}
      </div>

      {/* Log Items */}
      <div
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
                    : log.type}
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
