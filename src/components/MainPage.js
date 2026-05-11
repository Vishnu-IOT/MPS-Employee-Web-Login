import { useState } from 'react';
import SummaryPage from './SummaryPage';
import TaskListPage from './TaskListPage';

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M8 2v12M2 8h12" />
  </svg>
);

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="4" cy="8" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="12" cy="8" r="1.5" />
  </svg>
);

// ─────────────────────────────────────────
// Tab names — add/remove here as needed
// ─────────────────────────────────────────
const TABS = ['Summary', 'Calendar', 'List'];

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('List'); // ← ADD THIS (default tab)

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        //  position: 'relative'
      }}
    >
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, color: '#626f86' }}>Spaces</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg,#1e88e5,#42a5f5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          S
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: '#172b4d',
            letterSpacing: '-0.02em',
          }}
        >
          My Task Space
        </h1>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#626f86',
            display: 'flex',
            padding: 4,
            borderRadius: 3,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3a5 5 0 100 10A5 5 0 008 3zM8 6v4M6 8h4" />
          </svg>
        </button>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#626f86',
            display: 'flex',
            padding: 4,
            borderRadius: 3,
          }}
        >
          <DotsIcon />
        </button>
        {/* <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['share', 'bolt', 'chat', 'expand'].map((ic, i) => (
            <button
              key={i}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#626f86',
                padding: '6px 8px',
                borderRadius: 3,
                fontSize: 13,
              }}
            >
              ⊞
            </button>
          ))}
        </div> */}
      </div>
      {/* ── Nav tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '2px solid #ebecf0',
          marginBottom: 16,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)} // ← THIS makes each tab clickable
            style={{
              padding: '8px 14px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: activeTab === tab ? 600 : 400, // ← active tab bold
              color: activeTab === tab ? '#0052cc' : '#42526e', // ← active tab blue
              borderBottom:
                activeTab === tab
                  ? '2.5px solid #0052cc'
                  : '2.5px solid transparent',
              marginBottom: -2,
              transition: 'color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
        <button
          style={{
            padding: '8px 14px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 14,
            color: '#42526e',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          More{' '}
          <span
            style={{
              background: '#dfe1e6',
              borderRadius: 10,
              padding: '1px 6px',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            1
          </span>
        </button>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#626f86',
            padding: '8px 10px',
          }}
        >
          <PlusIcon />
        </button>
      </div>
      {/* ── Tab content ── */}
      {/* SUMMARY TAB */}
      {activeTab === 'Summary' && <SummaryPage />} {/* ← RENDERS SummaryPage */}
      {/* CALENDAR TAB */}
      {activeTab === 'Calendar' && (
        <div
          style={{
            padding: '40px 0',
            textAlign: 'center',
            color: '#626f86',
            fontSize: 14,
          }}
        >
          Calendar view coming soon…
        </div>
      )}
      {/* LIST TAB */}
      {activeTab === 'List' && <TaskListPage />}
    </div>
  );
}
