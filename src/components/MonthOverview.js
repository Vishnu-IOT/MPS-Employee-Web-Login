import React, { useState, useCallback, useEffect } from 'react';
import '../styles/MonthOverview.css';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import Lottie from 'lottie-react';
import animationData from '../lottie/Completing Tasks.json';
import { useNavigate } from 'react-router-dom';
import { fetchAttendanceByMonthAPI } from '../helper.js/api';

// ── Constants ────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LEGEND = [
  { dotClass: 'mo-legend__dot--present', text: 'Present' },
  { dotClass: 'mo-legend__dot--absent', text: 'Absent' },
  { dotClass: 'mo-legend__dot--leave', text: 'Leave' },
  { dotClass: 'mo-legend__dot--weekend', text: 'Weekend Holiday' },
  { dotClass: 'mo-legend__dot--common', text: 'Common Holiday' },
  { dotClass: 'mo-legend__dot--local', text: 'Local Holiday' },
];

const STATUS_CONFIG = {
  present: { label: 'PRESENT', color: '#22c55e' },
  late: { label: 'LATE', color: '#06b6d4' },
  absent: { label: 'ABSENT', color: '#9ca3af' },
  leave: { label: 'LEAVE', color: '#0ea5e9' },
  'sick-leave': { label: 'SICK LEAVE', color: '#f43f5e' },
  'casual-leave': { label: 'CASUAL LEAVE', color: '#8b5cf6' },
  lop: { label: 'LOSS OF PAY', color: '#ef4444' },
  onduty: { label: 'ON DUTY', color: '#3b82f6' },
  'local-holiday': { label: 'LOCAL HOLIDAY', color: '#166534' },
  'common-holiday': { label: 'COMMON HOLIDAY', color: '#7c3aed' },
  'weekend-holiday': { label: 'WEEKEND HOLIDAY', color: '#f97316' },
  today: { label: 'TODAY', color: '#111111' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isWeekend(date) {
  const d = date.getDay();
  return d === 0;
}

function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatFullDate(year, month, day) {
  return new Date(year, month, day).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildCalendarCells(year, month, attendanceMap) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const cells = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(year, month, 1 - (firstDay.getDay() - i));
    cells.push({
      day: d.getDate(),
      status: 'outside',
      label: null,
      isOutside: true,
      dateObj: d,
    });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    const key = toKey(date);
    const isToday = date.getTime() === today.getTime();

    let status,
      label = null;

    if (isToday) {
      status = 'today';
      label = 'Today';
    } else {
      const entry = attendanceMap.find((item) => item.date === key);

      if (entry) {
        if (entry.type === 'PRESENT') {
          if (entry.late_checkin) {
            status = 'late';
            label = `Late ${entry.late_checkin_time}`;
          } else {
            status = 'present';
            label = 'PRESENT';
          }
        } else if (entry.type === 'W-H') {
          status = 'weekend-holiday';
          label = 'W-Holiday';
        } else if (entry.type === 'C-H') {
          status = 'common-holiday';
          label = 'C-Holiday';
        } else if (entry.type === 'L-H') {
          status = 'local-holiday';
          label = 'L-Holiday';
        } else if (entry.type === 'LEAVE') {
          status = 'leave';
          label = 'LEAVE';
        } else {
          status = 'absent';
          label = 'ABSENT';
        }
      } else if (isWeekend(date)) {
        status = 'weekend-holiday';
        label = 'W-Holiday';
      } else {
        status = 'absent';
        label = null;
      }
    }

    cells.push({ day: d, status, label, isOutside: false, dateObj: date, key });
  }

  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    cells.push({
      day: d.getDate(),
      status: 'outside',
      label: null,
      isOutside: true,
      dateObj: d,
    });
  }

  return cells;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MoMonthNav({ title, onPrev, onNext }) {
  return (
    <div className="mo-month-nav">
      <button
        className="mo-month-nav__btn"
        onClick={onPrev}
        aria-label="Previous month"
      >
        &#8249;
      </button>
      <h2 className="mo-month-title">{title}</h2>
      <button
        className="mo-month-nav__btn"
        onClick={onNext}
        aria-label="Next month"
      >
        &#8250;
      </button>
    </div>
  );
}

function MoWeekdays() {
  return (
    <div className="mo-weekdays">
      {WEEKDAYS.map((d) => (
        <div key={d} className="mo-weekday">
          {d}
        </div>
      ))}
    </div>
  );
}

function MoDay({ day, status, label, isOutside, isSelected, onClick }) {
  if (isOutside) {
    return (
      <div className="mo-day mo-day--outside">
        <span className="mo-day__number">{day}</span>
      </div>
    );
  }
  return (
    <div
      className={`mo-day mo-day--${status} ${isSelected ? 'mo-day--selected' : ''}`}
      onClick={onClick}
    >
      <span className="mo-day__number">{day}</span>
      {label && <span className="mo-day__label">{label}</span>}
    </div>
  );
}

function MoGrid({ cells, selectedKey, onSelect }) {
  return (
    <div className="mo-grid">
      {cells.map((cell, idx) => (
        <MoDay
          key={idx}
          day={cell.day}
          status={cell.status}
          label={cell.label}
          isOutside={cell.isOutside}
          isSelected={cell.key === selectedKey}
          onClick={cell.isOutside ? undefined : () => onSelect(cell)}
        />
      ))}
    </div>
  );
}

function MoLegend() {
  return (
    <div className="mo-legend">
      {LEGEND.map(({ dotClass, text }) => (
        <div key={text} className="mo-legend__item">
          <span className={`mo-legend__dot ${dotClass}`} />
          <span className="mo-legend__text">{text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Day Detail Panel ──────────────────────────────────────────────────────────

function DayDetail({ selectedCell, attendanceMap, year, month, onClose }) {
  if (!selectedCell) {
    return (
      <div className="mo-detail mo-detail--empty">
        <div className="mo-detail__empty-icon">📅</div>
        <p className="mo-detail__empty-text">Select a date to view details</p>
      </div>
    );
  }

  const key = selectedCell.key;
  const entry = attendanceMap.find((item) => item.date === key);
  const status = selectedCell.status;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['absent'];
  const fullDate = formatFullDate(year, month, selectedCell.day);

  const formatTo12Hour = (timeStr) => {
    if (
      !timeStr ||
      timeStr === '-:--:--' ||
      timeStr === '--:--:--' ||
      timeStr === '--:--'
    )
      return '--:--:--';

    const date = new Date(`1970-01-01T${timeStr}`);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // ✅ include seconds
      hour12: true,
    });
  };

  return (
    <div className="mo-detail">
      {/* Close button — mobile only */}
      <button className="mo-detail__close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      {/* Status header */}
      <div className="mo-detail__header" style={{ background: config.color }}>
        <div className="mo-detail__date">{fullDate}</div>
        <div className="mo-detail__badge">{config.label}</div>
      </div>

      {/* Detail rows */}
      {entry ? (
        <div className="mo-detail__body">
          <div className="mo-detail__row">
            <div className="mo-detail__col">
              <span className="mo-detail__col-label">Check In</span>
              <span className="mo-detail__col-value">
                {formatTo12Hour(entry.check_in)}
              </span>
            </div>
            <div className="mo-detail__col">
              <span className="mo-detail__col-label">Check Out</span>
              <span className="mo-detail__col-value">
                {formatTo12Hour(entry.check_out)}
              </span>
            </div>
          </div>
          <div className="mo-detail__divider" />
          <div className="mo-detail__row">
            <div className="mo-detail__col">
              <span className="mo-detail__col-label">Break In</span>
              <span className="mo-detail__col-value">
                {formatTo12Hour(entry.break_in)}
              </span>
            </div>
            <div className="mo-detail__col">
              <span className="mo-detail__col-label">Break Out</span>
              <span className="mo-detail__col-value">
                {formatTo12Hour(entry.break_out)}
              </span>
            </div>
          </div>
          <div className="mo-detail__divider" />
          <div className="mo-detail__row">
            <div className="mo-detail__col">
              <span className="mo-detail__col-label">Break Minutes</span>
              <span className="mo-detail__col-value">
                {entry.total_break_minutes}
              </span>
            </div>
            <div className="mo-detail__col">
              <span className="mo-detail__col-label">Late Minutes</span>
              <span className="mo-detail__col-value">
                {entry.late_checkin_time}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mo-detail__no-data">
          <span className="mo-detail__no-data-icon">🗓</span>
          <p>No data available for this day</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MonthOverview() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedCell, setSelectedCell] = useState(null);

  const [calanderData, setCalanderData] = useState([]);

  useEffect(() => {
    async function monthlyReport() {
      // setLoadingState(true); // start loading

      try {
        const data = await fetchAttendanceByMonthAPI({
          month: month + 1,
          year: year,
        });
        setCalanderData(
          Array.isArray(data?.data.attendance) ? data.data.attendance : []
        );
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoadingState(false); // stop loading
      }
    }

    monthlyReport();
  }, [year, month]);

  const goPrev = useCallback(() => {
    setSelectedCell(null);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }, [month]);

  const goNext = useCallback(() => {
    setSelectedCell(null);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }, [month]);

  const handleSelectCell = useCallback((cell) => {
    setSelectedCell(cell);
  }, []);

  const cells = buildCalendarCells(year, month, calanderData);
  const title = formatMonthYear(year, month);

  return (
    <div className="mo-app">
      <div className="mo-container">
        <div className="mr-report-fixed">
          <div className="report-top">
            <div className="report-back">
              <button className="down-btn" onClick={() => navigate('/report')}>
                <MdKeyboardArrowLeft />
              </button>
              <h3 style={{ fontWeight: 600, fontSize: '16px' }}>
                Monthly Overview
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
                    <h2>Monthly Overview</h2>
                    <p>
                      Get a complete monthly overview of employee attendance,
                      including present days, absences, leaves, holidays, and
                      overall work activity across your organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Calendar + Detail side by side (desktop) ── */}
        <div className="mo-calender">
          <div className="mo-calendar-wrapper">
            <MoMonthNav title={title} onPrev={goPrev} onNext={goNext} />
            <MoWeekdays />
            <MoGrid
              cells={cells}
              selectedKey={selectedCell?.key}
              onSelect={handleSelectCell}
            />
            <MoLegend />
          </div>

          {/* Desktop detail panel */}
          <div className="mo-detail-wrapper">
            <DayDetail
              selectedCell={selectedCell}
              attendanceMap={calanderData}
              year={year}
              month={month}
              onClose={() => setSelectedCell(null)}
            />
          </div>
        </div>

        {/* Mobile overlay */}
        {/* {mobileDetailOpen && (
          <MobileDetailOverlay
            selectedCell={selectedCell}
            attendanceMap={attendanceData}
            year={year}
            month={month}
            onClose={handleCloseOverlay}
          />
        )} */}
      </div>
    </div>
  );
}
