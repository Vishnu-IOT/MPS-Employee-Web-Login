import { useEffect, useState } from 'react';
import '../styles/SummaryPage.css';
import { fetchDailySalarySlipAPI, fetchSummaryDataAPI } from '../helper.js/api';

/* ── Icons ── */
const CheckCircleIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TaskCreatedIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

/* ── Priority breakdown icons ── */
const HighestIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#c9372c"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 11l6-6 6 6" />
    <path d="M2 6l6-6 6 6" />
  </svg>
);

const HighIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#e2341d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 10l6-6 6 6" />
  </svg>
);

const MediumIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#ff8b00"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M2 6h12M2 10h12" />
  </svg>
);

const LowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#626f86"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 6l6 6 6-6" />
  </svg>
);

const LowestIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#626f86"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4l6 6 6-6" />
    <path d="M2 9l6 6 6-6" />
  </svg>
);

/* ── Donut Chart ── */
const DonutChart = ({ total, segments }) => {
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const strokeDasharray = `${dash} ${gap}`;
    const strokeDashoffset = -offset * circumference;
    offset += pct;
    return { ...seg, strokeDasharray, strokeDashoffset };
  });

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#ebecf0"
        strokeWidth={strokeWidth}
      />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={arc.strokeDasharray}
          strokeDashoffset={arc.strokeDashoffset}
          strokeLinecap="butt"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      ))}
    </svg>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon, count, label, subLabel, accent }) => (
  <div className="sp-stat-card">
    <div className="sp-stat-icon" style={{ color: accent }}>
      {icon}
    </div>
    <div className="sp-stat-info">
      <div className="sp-stat-count">{count}</div>
      <div className="sp-stat-label">{label}</div>
      <div className="sp-stat-sublabel">{subLabel}</div>
    </div>
  </div>
);

/* ── Priority data ── */
const PRIORITIES = [
  {
    key: 'highest',
    label: 'Highest',
    icon: <HighestIcon />,
    value: 4,
    color: '#c9372c',
  },
  {
    key: 'high',
    label: 'High',
    icon: <HighIcon />,
    value: 2,
    color: '#e2341d',
  },
  {
    key: 'medium',
    label: 'Medium',
    icon: <MediumIcon />,
    value: 1,
    color: '#8993a4',
  },
  { key: 'low', label: 'Low', icon: <LowIcon />, value: 0, color: '#626f86' },
  {
    key: 'lowest',
    label: 'Lowest',
    icon: <LowestIcon />,
    value: 1,
    color: '#626f86',
  },
];

const Y_TICKS = [0, 0.5, 1];

/* ── Main Component ── */
export default function SummaryPage() {
  const [summaryData, setSummaryData] = useState([]);
  const totalTasks = summaryData?.total;
  // + summaryData?.in_progress +
  // summaryData?.completed
  // + summaryData?.not_completed;

  const segments = [
    { label: 'TO DO', value: summaryData?.todo, color: '#0052cc' },
    { label: 'IN PROGRESS', value: summaryData?.in_progress, color: '#ff8b00' },
    { label: 'COMPLETED', value: summaryData?.completed, color: '#06cb62' },
    // {
    //   label: 'NOT COMPLETED',
    //   value: summaryData?.not_completed,
    //   color: '#ff0000',
    // },
  ];
  const maxValue = Math.max(...PRIORITIES.map((p) => p.value), 1);

  useEffect(() => {
    const summary = async () => {
      // setLoadingState(true);
      try {
        const data = await fetchSummaryDataAPI();
        await fetchDailySalarySlipAPI();
        if (data.success) {
          setSummaryData(data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        // setLoadingState(false);
      }
    };
    summary();
  }, []);

  return (
    <div className="sp-root">
      {/* Filter bar */}
      <div className="sp-filter-bar">
        <button className="sp-filter-btn">
          <FilterIcon />
          Filter
        </button>
      </div>

      {/* Stat cards row */}
      <div className="sp-stats-row">
        <StatCard
          icon={<CheckCircleIcon />}
          count={summaryData?.completed}
          label="completed"
          subLabel="in the last 7 days"
          accent="#626f86"
        />
        <StatCard
          icon={<EditIcon />}
          count={summaryData?.in_progress}
          label="updated"
          subLabel="in the last 7 days"
          accent="#626f86"
        />
        <StatCard
          icon={<TaskCreatedIcon />}
          count={summaryData?.todo}
          label="created"
          subLabel="in the last 7 days"
          accent="#626f86"
        />
        <StatCard
          icon={<CalendarIcon />}
          count={1}
          label="due soon"
          subLabel="in the next 7 days"
          accent="#e2581a"
        />
      </div>

      {/* Main panels */}
      <div className="sp-panels">
        {/* Status Overview */}
        <div className="sp-panel sp-panel--status">
          <div className="sp-panel-header">
            <div>
              <h3 className="sp-panel-title">Status overview</h3>
              <p className="sp-panel-sub">
                Get a snapshot of the status of your work items.{' '}
                {/* <a href="#" className="sp-link"> */}
                  View all work items
                {/* </a> */}
              </p>
            </div>
          </div>
          <div className="sp-donut-area">
            <div className="sp-donut-chart">
              <DonutChart total={totalTasks} segments={segments} />
              <div className="sp-donut-center">
                <span className="sp-donut-number">{totalTasks}</span>
                <span className="sp-donut-label">
                  Total work item{totalTasks !== 1 ? 's' : '...'}
                </span>
              </div>
            </div>
            <div className="sp-donut-legend">
              {segments.map((seg) => (
                <div key={seg.label} className="sp-legend-item">
                  <span
                    className="sp-legend-dot"
                    style={{ background: seg.color }}
                  />
                  <span className="sp-legend-text">
                    {seg.label}: {seg.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Breakdown — replaces Recent Activity */}
        <div className="sp-panel sp-panel--priority">
          <div className="sp-panel-header">
            <div>
              <h3 className="sp-panel-title">Priority breakdown</h3>
              <p className="sp-panel-sub">
                Get a holistic view of how work is being prioritized.{' '}
                {/* <a href="#" className="sp-link"> */}
                  How to manage priorities for spaces
                {/* </a> */}
              </p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="pb-chart">
            {/* Y-axis */}
            <div className="pb-y-axis">
              {[...Y_TICKS].reverse().map((tick) => (
                <div key={tick} className="pb-y-tick">
                  <span className="pb-y-label">{tick}</span>
                </div>
              ))}
            </div>

            {/* Plot area with grid + bars */}
            <div className="pb-plot">
              <div className="pb-grid">
                {Y_TICKS.map((tick) => (
                  <div
                    key={tick}
                    className="pb-grid-line"
                    style={{ bottom: `${(tick / maxValue) * 100}%` }}
                  />
                ))}
              </div>
              <div className="pb-bars">
                {PRIORITIES.map((p) => (
                  <div key={p.key} className="pb-bar-col">
                    <div className="pb-bar-track">
                      <div
                        className="pb-bar-fill"
                        style={{
                          height: `${(p.value / maxValue) * 100}%`,
                          background: p.color,
                        }}
                        title={`${p.label}: ${p.value}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="pb-x-axis">
            {PRIORITIES.map((p) => (
              <div key={p.key} className="pb-x-label">
                {p.icon}
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
