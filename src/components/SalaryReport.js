import React, { useEffect, useState, useRef } from 'react';
import '../styles/SalaryReport.css';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchDailySalarySlipAPI } from '../helper.js/api';
import PaySlipPDF from './PaySlipPDF';

function CustomSelect({ name, value, onChange, options }) {
  const open = false;

  return (
    <div className="ps-custom-select">
      <select
        className={`ps-custom-select__trigger ${
          open ? 'ps-custom-select__trigger--open' : ''
        }`}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <svg
        className="ps-custom-select__chevron"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5b5fcf"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function SalaryReport() {
  const navigate = useNavigate();
  const payslipRef = useRef();
  const [salaryData, setSalaryData] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

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
    const salary = async () => {
      // setLoadingState(true);
      try {
        const data = await fetchDailySalarySlipAPI();
        if (data?.success && data?.data?.length > 0) {
          setSalaryData(data?.data[0]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        // setLoadingState(false);
      }
    };
    salary();
  }, []);

  const data = {
    company: 'MPS Pvt Ltd',
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n));

  const initials = salaryData?.employee_name
    .trim()
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const monthName = new Date(
    salaryData?.year,
    salaryData?.month - 1
  ).toLocaleString('en-US', {
    month: 'long',
  });

  const handleGenerate = async () => {
    setGenerating(true);

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);

      payslipRef.current?.downloadPayslip();

      setTimeout(() => {
        setGenerated(false);
        setShowDialog(false);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="sr-wrapper">
      {/* Top Bar (visible on mobile) */}
      <div className="report-back">
        <button className="down-btn" onClick={() => navigate('/home')}>
          <MdKeyboardArrowLeft />
        </button>
        <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Pay Slip</h3>
      </div>

      <PaySlipPDF ref={payslipRef} dateFilter={dateFilter} />

      <div className="sr-payslip-btn">
        <button
          className="btn-download"
          onClick={() => {
            setShowDialog(true);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Payslip
        </button>
      </div>

      <div className="sr-phone">
        {/* Hero Card */}
        <div className="sr-hero">
          <div className="sr-hero-left">
            <p className="sr-label">Salary Report</p>
            <h2 className="sr-company">{data.company}</h2>
            <div className="sr-emp-row">
              <div className="sr-avatar">{initials}</div>
              <div>
                <p className="sr-emp-name">{salaryData?.employee_name}</p>
                <p className="sr-emp-id">EMP ID: {salaryData?.employee_id}</p>
              </div>
            </div>
          </div>
          <div className="sr-hero-right">
            <div className="sr-month-badge">
              <span className="sr-month-text">
                {monthName} {salaryData?.year}
              </span>
              <span className="sr-month-num">Month {salaryData?.month}</span>
            </div>

            <div className="sr-desk-btn">
              <button
                className="btn-download"
                onClick={() => {
                  setShowDialog(true);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Payslip
              </button>
            </div>
          </div>
        </div>
        <div className="sr-bg-card">
          {/* Attendance Summary Cards */}
          <div className="sr-cards">
            <div className="sr-card sr-card--neutral">
              <p className="sr-card-label">WORKING DAYS</p>
              <p className="sr-card-value">{salaryData?.working_days}</p>
            </div>
            <div className="sr-card sr-card--green">
              <p className="sr-card-label sr-card-label--green">PRESENT</p>
              <p className="sr-card-value sr-card-value--green">
                {salaryData?.present_days}
              </p>
            </div>
            <div className="sr-card sr-card--red">
              <p className="sr-card-label sr-card-label--red">ABSENT</p>
              <p className="sr-card-value sr-card-value--red">
                {salaryData?.absent_days}
              </p>
            </div>
          </div>

          {/* Two-column on desktop / stacked on mobile */}
          <div className="sr-grid">
            {/* Left: Attendance Breakdown */}
            <div className="sr-section">
              <p className="sr-section-title">ATTENDANCE BREAKDOWN</p>
              <div className="sr-table">
                {[
                  ['Total days', salaryData?.total_days, false],
                  ['Sundays', salaryData?.sundays, false],
                  ['Holidays', salaryData?.holidays, false],
                  ['Paid leave', salaryData?.paid_leave_days, false],
                  [
                    'LOP days',
                    salaryData?.lop_leave_days + salaryData?.half_leave_days ||
                      0,
                    true,
                  ],
                ].map(([label, value, highlight]) => (
                  <div className="sr-row" key={label}>
                    <span className="sr-row-label">{label}</span>
                    <span
                      className={`sr-row-value${highlight ? ' sr-row-value--orange' : ''}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <div className="sr-table-note">
                  <span className="sr-note-icon">ℹ</span>
                  <span>Based on company policy revision dated Jan 2026.</span>
                </div>
              </div>
            </div>

            {/* Right: Salary Details */}
            <div className="sr-section">
              <p className="sr-section-title">SALARY DETAILS</p>
              <div className="sr-table">
                <div className="sr-row">
                  <span className="sr-row-label">Base salary</span>
                  <span className="sr-row-value">
                    ₹{fmt(salaryData?.base_salary)}
                  </span>
                </div>
                <div className="sr-row">
                  <span className="sr-row-label">Per day salary</span>
                  <span className="sr-row-value">
                    ₹{fmt(salaryData?.per_day_salary)}
                  </span>
                </div>
                <div className="sr-row">
                  <span className="sr-row-label">Paid days</span>
                  <span className="sr-row-value">{salaryData?.paid_days}</span>
                </div>
                <div className="sr-row">
                  <span className="sr-row-label">LOP deduction</span>
                  <span className="sr-row-value sr-row-value--red">
                    - ₹{fmt(salaryData?.lop_amount) || 0}
                  </span>
                </div>
                <div className="sr-table-note sr-table-note--right">
                  Calculated per {salaryData?.month_days} calendar days.
                </div>
              </div>
              {/* <div className="sr-net">
              <div className="sr-net-left">
                <p className="sr-net-label">Net salary</p>
                <p className="sr-net-month">{data.meta.creditNote}</p>
              </div>
              <div className="sr-net-right">
                <p className="sr-net-amount">₹{fmt(data.salary.net)}</p>
                <span className="sr-net-badge">
                  <span className="sr-net-check">✓</span>
                  {data.meta.status}
                </span>
              </div>
             </div> */}
            </div>
          </div>

          {/* Net Salary Footer */}
          <div className="sr-net">
            <div className="sr-net-left">
              <p className="sr-net-label">Net salary</p>
              <p className="sr-net-month">
                {monthName} {salaryData?.year}
              </p>
            </div>
            <div className="sr-net-right">
              <p className="sr-net-amount">₹{fmt(salaryData?.final_salary)}</p>
              {/* <span className="sr-net-badge">
                <span className="sr-net-check">✓</span>
                {data.meta.status}
              </span> */}
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <div
          className="ps-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDialog(false);
          }}
        >
          <div className="ps-dialog">
            {/* Header */}
            <div className="ps-dialog__header">
              <div>
                <h2 className="ps-dialog__title">Generate Salary Slip</h2>

                <p className="ps-dialog__subtitle">
                  Select the reporting period for the employee payroll summary.
                </p>
              </div>

              <button
                className="ps-dialog__close"
                onClick={() => setShowDialog(false)}
              >
                ✕
              </button>
            </div>

            {/* Select Row */}
            <div className="ps-selects-row">
              <div className="ps-select-group">
                <label className="ps-select-group__label">Month</label>

                <CustomSelect
                  name="month"
                  value={dateFilter.month}
                  onChange={handleDate}
                  options={monthOptions}
                />
              </div>

              <div className="ps-select-group">
                <label className="ps-select-group__label">Year</label>

                <CustomSelect
                  name="year"
                  value={dateFilter.year}
                  onChange={handleDate}
                  options={yearOptions.map((y) => ({
                    label: y,
                    value: y,
                  }))}
                />
              </div>
            </div>

            {/* Info Banner */}
            <div className="ps-info-banner">
              <svg
                className="ps-info-banner__icon"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5b5fcf"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />

                <line x1="12" y1="16" x2="12" y2="12" />

                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>

              <span>
                Generated reports will be downloaded directly and can be
                accessed from your Chrome Downloads section.
              </span>
            </div>

            {/* Actions */}
            <div className="ps-dialog__actions">
              <button
                className="ps-btn-cancel"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>

              <button
                className={`ps-btn-generate ${
                  generating ? 'ps-btn-generate--loading' : ''
                } ${generated ? 'ps-btn-generate--success' : ''}`}
                onClick={handleGenerate}
                disabled={generating || generated}
              >
                {generating ? (
                  <>
                    <svg
                      className="ps-spinner"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />

                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Generating...
                  </>
                ) : generated ? (
                  <>✓ Report Ready!</>
                ) : (
                  <>
                    <span className="ps-btn-generate__icon">✦</span>
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalaryReport;
