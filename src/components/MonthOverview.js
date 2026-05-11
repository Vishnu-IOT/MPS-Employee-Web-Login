import React, { useState, useCallback } from 'react';
import '../styles/MonthOverview.css';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import Lottie from 'lottie-react';
import animationData from '../lottie/Completing Tasks.json';
import { useNavigate } from 'react-router-dom';
// import loading from '../lottie/loading.json';

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

// ── Helpers ──────────────────────────────────────────────────────────────────

function isWeekend(date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleString('en-US', {
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

/**
 * Build a flat 42-cell grid (6 rows × 7 cols) for the given year/month.
 * Looks up attendance from `attendanceMap` (Map<"YYYY-MM-DD", {status, label}>).
 * Weekend days → "weekend-holiday" automatically.
 * Today → "today".
 * No entry + past/future weekday → "absent".
 */
function buildCalendarCells(year, month, attendanceMap) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const cells = [];

  // Leading days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(year, month, 1 - (firstDay.getDay() - i));
    cells.push({
      day: d.getDate(),
      status: 'outside',
      label: null,
      isOutside: true,
    });
  }

  // Days in current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    const key = toKey(date);
    const isToday = date.getTime() === today.getTime();

    let status;
    let label = null;

    if (isToday) {
      status = 'today';
      label = 'Today';
    } else if (attendanceMap.has(key)) {
      const entry = attendanceMap.get(key);
      status = entry.status;
      label = entry.label || null;
    } else if (isWeekend(date)) {
      status = 'weekend-holiday';
      label = 'W-Holiday';
    } else {
      status = 'absent';
    }

    cells.push({ day: d, status, label, isOutside: false });
  }

  // Trailing days from next month
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    cells.push({
      day: d.getDate(),
      status: 'outside',
      label: null,
      isOutside: true,
    });
  }

  return cells;
}

// ── Sample attendance data ───────────────────────────────────────────────────
// Replace with real API/prop data. Keys: "YYYY-MM-DD"
// Valid statuses: "present" | "late" | "leave" | "common-holiday" | "local-holiday"

const SAMPLE_ATTENDANCE = new Map([
  ['2026-05-01', { status: 'common-holiday', label: 'C-Holiday' }],
  ['2026-05-02', { status: 'present', label: 'PRESENT' }],
  ['2026-05-04', { status: 'present', label: 'PRESENT' }],
  ['2026-05-05', { status: 'present', label: 'PRESENT' }],
  ['2026-05-06', { status: 'late', label: 'Late 00:06' }],
  ['2026-05-07', { status: 'late', label: 'Late 00:01' }],
]);

// ── Sub-components ───────────────────────────────────────────────────────────

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

function MoDay({ day, status, label }) {
  return (
    <div className={`mo-day mo-day--${status}`}>
      <span className="mo-day__number">{day}</span>
      {label && <span className="mo-day__label">{label}</span>}
    </div>
  );
}

function MoGrid({ cells }) {
  return (
    <div className="mo-grid">
      {cells.map((cell, idx) => (
        <MoDay
          key={idx}
          day={cell.day}
          status={cell.status}
          label={cell.label}
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

// ── Main Component ───────────────────────────────────────────────────────────

export default function MonthOverview({ attendanceData = SAMPLE_ATTENDANCE }) {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const goPrev = useCallback(() => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const goNext = useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const cells = buildCalendarCells(year, month, attendanceData);
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
        <div className="mo-calender">
          <div className="mo-calendar-wrapper">
            <MoMonthNav title={title} onPrev={goPrev} onNext={goNext} />
            <MoWeekdays />
            <MoGrid cells={cells} />
            <MoLegend />
          </div>

          {/* <hr className="mo-divider" /> */}

          <p className="mo-no-data">Data not available</p>
        </div>
      </div>
    </div>
  );
}
