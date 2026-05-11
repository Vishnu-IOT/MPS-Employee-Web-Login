import React, { useEffect, useState } from 'react';
import '../styles/SalaryReport.css';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchDailySalarySlipAPI } from '../helper.js/api';

function SalaryReport() {
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    const salary = async () => {
      // setLoadingState(true);
      try {
        const data = await fetchDailySalarySlipAPI();
        if (data?.success && data?.data?.length > 0) {
          console.log(data.data[0]);
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
    month: 'May 2026',
    monthNumber: 'Month 5',
    employee: {
      name: 'Ram',
      id: 'MPS015',
      initials: 'Ram',
    },
    attendance: {
      workingDays: 25,
      present: 6,
      absent: 16,
    },
    breakdown: {
      totalDays: 31,
      sundays: 5,
      holidays: 5,
      paidLeave: 1,
      lopDays: 0,
    },
    salary: {
      base: 18000,
      perDay: 581,
      paidDays: 9,
      lopDeduction: 12774,
      net: 5226,
    },
    meta: {
      policyNote: 'Based on company policy revision dated Jan 2026.',
      calendarNote: 'Calculated per 31 calendar days.',
      status: 'Approved & Processed',
      creditNote: 'May 2026',
    },
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

  return (
    <div className="sr-wrapper">
      {/* Top Bar (visible on mobile) */}
      <div className="report-back">
        <button className="down-btn" onClick={() => navigate('/home')}>
          <MdKeyboardArrowLeft />
        </button>
        <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Pay Slip</h3>
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
          <div className="sr-month-badge">
            <span className="sr-month-text">
              {monthName} {salaryData?.year}
            </span>
            <span className="sr-month-num">Month {salaryData?.month}</span>
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
                    salaryData?.lop_leave_days + salaryData?.half_leave_days,
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
                    - ₹{fmt(salaryData?.lop_amount)}
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
    </div>
  );
}

export default SalaryReport;
