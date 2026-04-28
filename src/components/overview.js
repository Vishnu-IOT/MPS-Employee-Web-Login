import { useEffect, useRef, useState } from 'react';
import MobileNav from './mobilenav';
import BottomNav from './BottomNav';
import {
  fetchAttendanceWMAPI,
  fetchHomePageAPI,
  fetchLiveLocationAddrAPI,
  storeMarkAttendanceAPI,
  storeTakeBreakAPI,
} from '../helper.js/api';
import Lottie from 'lottie-react';
import loading from '../lottie/loading.json';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

// ===== OVERVIEW SCREEN =====
export const OverviewScreen = () => {
  const [period, setPeriod] = useState('1W');
  const [wm, setWM] = useState('week');
  const [attendanceData, setAttendanceData] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();

  const [capturedImage, setCapturedImage] = useState(null);
  const [onBreak, setOnBreak] = useState(false);
  const [breakUsed, setBreakUsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liveLocation, setLiveLocation] = useState(false);

  const [actionType, setActionType] = useState('');
  const [actionTime, setActionTime] = useState(null);
  const [checkData, setCheckData] = useState({
    type: '',
    checkin_lat: '',
    checkin_lon: '',
    checkout_lat: '',
    checkout_lon: '',
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleAttendance = async (capturedBlob) => {
    setSubmitting(true);
    const formData = new FormData();

    Object.keys(checkData).forEach((key) => {
      if (
        checkData[key] !== '' &&
        checkData[key] !== null &&
        checkData[key] !== undefined
      ) {
        formData.append(key, checkData[key]);
      }
    });
    // 👉 attach image
    if (actionType === 'checkin' && capturedBlob) {
      formData.append('selfieimgin', capturedBlob, 'checkin.jpg');
    }

    if (actionType === 'checkout' && capturedBlob) {
      formData.append('selfieimgout', capturedBlob, 'checkout.jpg');
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await storeMarkAttendanceAPI(formData);
      setOpenDialog(false);
      setCheckData({
        type: '',
        checkin_lat: '',
        checkin_lon: '',
        checkout_lat: '',
        checkout_lon: '',
      });
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBreak = async () => {
    setSubmitting(true);
    try {
      await storeTakeBreakAPI(checkData);
      setOpenDialog(false);
      setCheckData({
        type: '',
        checkin_lat: '',
        checkin_lon: '',
        checkout_lat: '',
        checkout_lon: '',
      });
      setOnBreak((prev) => !prev);
      if (checkData.type === 'breakout') {
        setBreakUsed(true); // ✅ mark break completed
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  const canvasRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const webcamRef = useRef(null);

  const stopCamera = () => {
    const stream = webcamRef.current?.video?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1]; // image/jpeg ✅
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // ✅ ensure correct type
    return new Blob([u8arr], { type: mime });
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert('Camera not ready, try again');
      return;
    }

    setCapturedImage(imageSrc); // ✅ store preview
    setOpenDialog(false);
    stopCamera(); // close camera
  };

  const handleConfirm = () => {
    const blob = dataURLtoBlob(capturedImage);
    handleAttendance(blob); // ✅ now call API
    setCapturedImage(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setTimeout(() => setCameraOpen(true), 200);
  };

  const reversedData = [...attendanceData].reverse();

  useEffect(() => {
    async function overview() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchAttendanceWMAPI(wm);
        const data2 = await fetchHomePageAPI();
        setHomeData(data2);
        setAttendanceData(
          Array.isArray(data?.attendance) ? data.attendance : []
        );

        if (
          data2?.attendance?.break_in !== '--:--' &&
          data2?.attendance?.break_out !== '--:--'
        ) {
          setBreakUsed(true);
        }

        if (data2?.attendance?.break_in !== '--:--') {
          setOnBreak(true);
        } else {
          setOnBreak(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    overview();
  }, [wm, checkData]);

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
    if (!timeStr || timeStr === '-:--:--' || timeStr === '--:--:--')
      return '--:--:--';

    const date = new Date(`1970-01-01T${timeStr}`);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // ✅ include seconds
      hour12: true,
    });
  };

  const isCheckedIn = isValidTime(homeData?.attendance?.check_in?.time);
  const isCheckedOut = isValidTime(homeData?.attendance?.check_out?.time);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
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

  const handleAction = (type) => {
    const now = new Date();
    setActionTime(now);
    setActionType(type);
    setOpenDialog(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        let updatedData = { ...checkData };

        if (type === 'checkin') {
          updatedData = {
            ...updatedData,
            type: 'checkin',
            checkin_lat: latitude,
            checkin_lon: longitude,
          };
        }

        if (type === 'checkout') {
          updatedData = {
            ...updatedData,
            type: 'checkout',
            checkout_lat: latitude,
            checkout_lon: longitude,
          };
        }
        if (type === 'break') {
          updatedData = {
            ...updatedData,
            type: onBreak ? 'breakout' : 'breakin', // 👈 toggle
          };
        }

        setCheckData(updatedData);

        setLiveLocation('Fetching location...');

        try {
          const data = await fetchLiveLocationAddrAPI({
            checkin_lat: latitude,
            checkin_lon: longitude,
          });

          setLiveLocation(data?.display_name || 'Location not found');
        } catch (e) {
          setLiveLocation('Location unavailable');
        }
      },
      (err) => {
        alert('Location permission required');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // ⬅️ important
        maximumAge: 0,
      }
    );
  };

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
      <div className="overview-screen">
        {/* Today's Overview Section */}
        <div className="section-title" style={{ padding: '8px 16px 0' }}>
          Today's Overview
        </div>
        <div>
          <div
            className="overview-title"
            style={{
              background: 'rgb(31, 82, 196)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'var(--shadow-lg)',
              // position: 'relative',
              zIndex: 5,
              marginBottom: '0',
            }}
          >
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

            {!isCheckedIn ? (
              <button
                className="checkin-btn"
                onClick={() => handleAction('checkin')}
              >
                Check In
              </button>
            ) : isCheckedIn && !isCheckedOut ? (
              <div className="checkin-actions">
                {!breakUsed && (
                  <button
                    className={`break-btn ${onBreak ? 'danger-btn' : ''}`}
                    onClick={() => handleAction('break')}
                  >
                    {onBreak ? 'Back to Work' : 'Take Break'}
                  </button>
                )}

                <button
                  className="checkin-btn"
                  onClick={() => handleAction('checkout')}
                >
                  Check Out
                </button>
              </div>
            ) : (
              <button
                className="checkin-btn"
                disabled
                style={{ cursor: 'not-allowed' }}
              >
                Completed
              </button>
            )}
          </div>
        </div>

        {/* Check In and Check Out Camera */}
        {cameraOpen && (
          <div className="camera-overlay">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'user', // 👈 front camera
              }}
              className="camera-video"
            />

            <div className="camera-controls">
              <button className="close-btn" onClick={stopCamera}>
                ✖
              </button>
              <button className="capture-btn" onClick={capturePhoto}></button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="preview-overlay">
            <img src={capturedImage} alt="preview" className="preview-img" />

            <div className="preview-controls">
              <button onClick={handleRetake} className="submit-btn">
                🔄 Retake
              </button>

              <button onClick={handleConfirm} className="submit-btn">
                ✅ Submit
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Check In Overview */}
        {openDialog && (
          <div className="dialog-overlay" onClick={() => setOpenDialog(false)}>
            <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="dialog-title">
                {actionType === 'checkin'
                  ? 'Ready to start your day? 🚀'
                  : actionType === 'break'
                    ? onBreak
                      ? 'Back to Productivity 🕒'
                      : 'Break time! Relax a bit ☕'
                    : 'Time to relax, see you tomorrow 😊'}
              </h2>

              <div className="dialog-content">
                <div className="dialog-row">
                  <span className="icon">🕒</span>
                  <span>{fmt(actionTime)}</span>
                </div>

                <div className="dialog-row">
                  <span className="icon">📅</span>
                  <span>{fmtDate(time)}</span>
                </div>

                <div className="dialog-row">
                  <span className="icon">📍</span>
                  <span>{liveLocation ? liveLocation : 'Fetching Location...'}</span>
                </div>
              </div>

              <button
                className="submit-btn"
                disabled={submitting}
                onClick={() => {
                  if (actionType === 'checkin' || actionType === 'checkout') {
                    setCameraOpen(true); // ✅ only for selfie actions
                  } else {
                    handleBreak(); // ✅ directly call API for break
                    setOpenDialog(false);
                  }
                }}
              >
                {actionType === 'checkin'
                  ? 'Submit Check-In'
                  : actionType === 'break'
                    ? onBreak
                      ? 'Back to Work'
                      : 'Take Break'
                    : 'Submit Check-Out'}
              </button>
            </div>
          </div>
        )}

        {/* Attendance Overview */}
        <div className="attendance-row-header" style={{ marginTop: 20 }}>
          <span className="section-title" style={{ margin: 0 }}>
            Attendance Overview
          </span>
          <div className="period-tabs">
            <button
              className={`period-tab ${period === '1W' ? 'active' : ''}`}
              onClick={() => {
                setPeriod('1W');
                setWM('week');
              }}
            >
              1W
            </button>

            <button
              className={`period-tab ${period === '1M' ? 'active' : ''}`}
              onClick={() => {
                setPeriod('1M');
                setWM('month');
              }}
            >
              1M
            </button>
          </div>
        </div>

        {/* Log Items */}
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          {reversedData?.map((log, i) => (
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
          ))}
        </div>

        {/* Log Items */}
        {/* <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>
          Attendance Overview
        </h3> */}
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
                  {log.late_checkin
                    ? `Late ${log.late_checkin_time}`
                    : log.type}
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: capturedImage ? 'none' : 'flex',
        }}
      >
        {/* Bottom nav — hidden on desktop via CSS */}
        <BottomNav />
      </div>
    </>
  );
};
