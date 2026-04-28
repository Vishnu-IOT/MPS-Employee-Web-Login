import React, { useEffect, useState } from 'react';
import { MdHourglassBottom, MdKeyboardArrowLeft } from 'react-icons/md';
import '../styles/permission.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaBurger,
  FaClipboardQuestion,
  FaRegClock,
  FaStopwatch,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import { HiMiniDocumentCurrencyDollar } from 'react-icons/hi2';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { fetchOnDayAttendanceAPI } from '../helper.js/api';

function DayAttendance() {
  const [dayData, setDayData] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const attendance = location.state?.data;
  const isMobile = window.innerWidth < 900;

  useEffect(() => {
    async function home() {
      // setLoadingState(true); // start loading
      try {
        const data = await fetchOnDayAttendanceAPI(attendance);
        setDayData(data);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoadingState(false); // stop loading
      }
    }
    home();
  }, [attendance]);

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

  const data = [
    {
      icon: <FiLogIn />,
      value: formatTo12Hour(dayData?.attendance.check_in.time),
      label: 'Check In',
      bg: 'green',
      onClick: () => setPreviewImg(dayData?.attendance?.selfimgin),
    },
    {
      icon: <FiLogOut />,
      value: formatTo12Hour(dayData?.attendance.check_out.time),
      label: 'Check Out',
      bg: 'var(--red)',
      onClick: () => setPreviewImg(dayData?.attendance?.selfimgout),
    },
    {
      icon: <FaBurger />,
      value: formatTo12Hour(dayData?.attendance.break_in),
      label: 'Break-In',
      bg: 'orange',
    },
    {
      icon: <FaBurger />,
      value: formatTo12Hour(dayData?.attendance.break_out),
      label: 'Break-Out',
      bg: '#8A1F0A',
    },
    {
      icon: <FaBurger />,
      value: dayData?.attendance.total_break_minutes,
      label: 'Break-Time',
      bg: '#8A1F0A',
    },
    {
      icon: <FaStopwatch />,
      value: dayData?.attendance.worked_hours,
      label: 'Worked Hours',
      bg: '#59bfe1',
    },
    {
      icon: <MdHourglassBottom />,
      value: dayData?.attendance.remaining_hours,
      label: 'Remaining',
      bg: '#dd36d8',
    },
    {
      icon: <FaRegClock />,
      value: dayData?.attendance.overtime_hours,
      label: 'Overtime',
      bg: 'orange',
    },
    {
      icon: <FaTriangleExclamation />,
      value: dayData?.attendance.late_checkin ? 'Yes' : 'No',
      label: 'Late',
      bg: 'red',
    },
    {
      icon: <HiMiniDocumentCurrencyDollar />,
      value: dayData?.attendance.permission_status ? 'Yes' : 'No',
      label: 'Permission',
      bg: 'green',
    },
    {
      icon: <FaClipboardQuestion />,
      value: dayData?.attendance.late_checkin_time,
      label: 'Late Time',
      bg: 'green',
    },
    {
      icon: <HiMiniDocumentCurrencyDollar />,
      value: dayData?.attendance.permission_time,
      label: 'Permission Time',
      bg: 'green',
    },
  ];

  const FormContent = (
    <div className="attend-card modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => navigate('/attendance')}>
        ×
      </button>

      <h2 className="form-title">Attendance Details</h2>

      {previewImg && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImg(null)}
        >
          <button className="close-btn" onClick={() => setPreviewImg(null)}>
            ×
          </button>
          <div
            className="image-preview-box"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImg} alt="Attendance" />
            {/* <button onClick={() => setPreviewImg(null)}>Close</button> */}
          </div>
        </div>
      )}

      <div className="grid">
        {data.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={item.onClick}
            style={{ cursor: item.onClick ? 'pointer' : 'default' }}
          >
            <div className="icons" style={{ color: item.bg }}>
              {item.icon}
            </div>
            <div className="value">{item.value}</div>
            <div className="label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="permission-screen">
      {/* Header */}
      <div className="report-top">
        <div className="report-back">
          <button className="down-btn" onClick={() => navigate('/attendance')}>
            <MdKeyboardArrowLeft />
          </button>
          <h3 style={{ fontWeight: 600, fontSize: '16px' }}>
            Attendance Details
          </h3>
        </div>
      </div>

      {/* Conditional Render */}
      {isMobile ? (
        <div className="mobile-form-wrapper">{FormContent}</div>
      ) : (
        <div
          className="dialog-overlays"
          onClick={() => navigate('/attendance')}
        >
          {FormContent}
        </div>
      )}
    </div>
  );
}

export default DayAttendance;
