import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import '../styles/SalaryReport.css';
import logo from '../assets/logo.png';
import { fetchMonthlySalarySlipAPI } from '../helper.js/api';
import html2canvas from 'html2canvas'; // ← direct import
import jsPDF from 'jspdf'; // ← direct import

const payslipData = {
  company: {
    name: 'MPeoples Business Solutions Pvt Ltd',
    address: 'Salem, Tamil Nadu, India',
  },
  amountInWords: 'Three Thousand Six Hundred Twelve Rupees Only',
};

const Payslip = forwardRef(({ dateFilter }, ref) => {
  const printRef = useRef();
  const [slipData, setSlipData] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
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

  useEffect(() => {
    const salarySlip = async () => {
      try {
        const data = await fetchMonthlySalarySlipAPI(dateFilter);
        if (data?.success) {
          setSlipData(data?.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    salarySlip();
  }, [dateFilter]);

  const selectedMonth = monthOptions.find(
    (m) => parseFloat(m.value) === slipData?.month
  );

  const { company, amountInWords } = payslipData;

  const handleDownload = async () => {
    if (!printRef.current || !slipData) {
      console.warn('Slip data not ready yet.');
      return;
    }

    const original = printRef.current;

    // ── 1. Clone the hidden payslip ──
    const clone = original.cloneNode(true);

    Object.assign(clone.style, {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '800px',
      background: '#ffffff',
      zIndex: '-9999',
      visibility: 'visible',
      display: 'block',
      overflow: 'visible',
    });

    document.body.appendChild(clone);

    // ── 2. Wait for fonts + layout to settle ──
    await new Promise((r) => setTimeout(r, 600));

    try {
      // ── 3. Capture with html2canvas (imported, not window.*) ──
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY, // account for page scroll offset
        windowWidth: 800,
        backgroundColor: '#ffffff',
        x: 0,
        y: 0,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });

      console.log('Canvas captured:', canvas.width, 'x', canvas.height);

      // ── 4. Build PDF from canvas ──
      const pdf = new jsPDF({
        unit: 'px',
        format: 'a4',
        orientation: 'portrait',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages if content overflows
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `Payslip-${slipData?.employee_name}-${selectedMonth?.label}-${slipData?.year}.pdf`
      );
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      // ── 5. Always clean up the clone ──
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    downloadPayslip: handleDownload,
  }));

  return (
    <div className="payslip-page">
      {/* Hidden payslip — used only for PDF capture */}
      <div className="payslip-hidden" ref={printRef}>
        <div className="ps-card">
          {/* Header */}
          <div className="ps-header">
            <div className="ps-header-left">
              <div className="ps-logo">
                <img src={logo} alt="_logo" />
              </div>
              <div>
                <div className="ps-co-name">{company.name}</div>
                <div className="ps-co-sub">{company.address}</div>
              </div>
            </div>
            <div className="ps-header-right">
              <div>
                <span className="ps-badge">SALARY SLIP</span>
              </div>
              <div className="ps-month">
                {selectedMonth?.label} {slipData?.year}
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="ps-info-grid">
            <div className="ps-info-cell">
              <div className="ps-cell-label">Employee Name</div>
              <div className="ps-cell-value">{slipData?.employee_name}</div>
            </div>
            <div className="ps-info-cell">
              <div className="ps-cell-label">Employee ID</div>
              <div className="ps-cell-value">{slipData?.employee_id}</div>
            </div>
            <div className="ps-info-cell">
              <div className="ps-cell-label">Pay Period</div>
              <div className="ps-cell-value">
                {selectedMonth?.label} {slipData?.year}
              </div>
            </div>
            <div className="ps-info-cell last-row">
              <div className="ps-cell-label">Designation</div>
              <div className="ps-cell-value">{user?.designation}</div>
            </div>
            <div className="ps-info-cell last-row">
              <div className="ps-cell-label">Department</div>
              <div className="ps-cell-value">{user?.position}</div>
            </div>
            <div className="ps-info-cell last-row">
              <div className="ps-cell-label">Generated On</div>
              <div className="ps-cell-value">{currentDate}</div>
            </div>
          </div>

          {/* Attendance */}
          <div className="ps-section-title">Attendance Summary</div>
          <div className="ps-att-grid">
            <div className="ps-att-cell">
              <div className="ps-att-label">Total Days</div>
              <div className="ps-att-value">{slipData?.total_days}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Working Days</div>
              <div className="ps-att-value">{slipData?.working_days}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Sundays</div>
              <div className="ps-att-value">{slipData?.total_sundays}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Holidays</div>
              <div className="ps-att-value">{slipData?.total_holidays}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Days Present</div>
              <div className="ps-att-value">{slipData?.present_days}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Paid Leave</div>
              <div className="ps-att-value">{slipData?.paid_leave_days}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Half Day</div>
              <div className="ps-att-value">{slipData?.half_leave_days}</div>
            </div>
            <div className="ps-att-cell">
              <div className="ps-att-label">Absent / LOP</div>
              <div className="ps-att-value red">{slipData?.lop_leave_days}</div>
            </div>
            <div className="ps-att-cell last-row">
              <div className="ps-att-label">Paid Days</div>
              <div className="ps-att-value">{slipData?.worked_days}</div>
            </div>
            <div className="ps-att-cell last-row">
              <div className="ps-att-label">Late (Min)</div>
              <div className="ps-att-value">{slipData?.late_minutes}</div>
            </div>
            <div className="ps-att-cell last-row">
              <div className="ps-att-label">Permission (Min)</div>
              <div className="ps-att-value">{slipData?.permission_minutes}</div>
            </div>
            <div className="ps-att-cell last-row">
              <div className="ps-att-label">Per Day Rate</div>
              <div className="ps-att-value">{slipData?.per_day_salary}</div>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="ps-section-title">Earnings &amp; Deductions</div>
          <div className="ps-ed-grid">
            <table className="ps-table">
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td>{slipData?.base_salary}</td>
                </tr>
                <tr className="total">
                  <td>
                    <strong>Gross Earnings</strong>
                  </td>
                  <td>
                    <strong>{slipData?.base_salary}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="ps-table">
              <thead>
                <tr>
                  <th>Deductions</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Loss of Pay (LOP)</td>
                  <td className="red-text">{slipData?.lop_amount}</td>
                </tr>
                <tr className="total">
                  <td>
                    <strong>Total Deductions</strong>
                  </td>
                  <td className="red-text">
                    <strong>{slipData?.lop_amount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Pay */}
          <div className="ps-net-pay">
            <div>
              <div className="ps-net-label">Net Pay</div>
              <div className="ps-net-period">
                {selectedMonth?.label} {slipData?.year}
              </div>
            </div>
            <div className="ps-net-amount">{slipData?.final_salary}</div>
          </div>

          {/* Amount in Words */}
          <div className="ps-words">
            <strong>AMOUNT IN WORDS:</strong> <em>{amountInWords}</em>
          </div>

          {/* Footer */}
          <div className="ps-footer">
            <div className="ps-footer-left">
              <p>Payroll processed by MPeoples Business Solutions Pvt Ltd</p>
              <p>This is a system-generated document. No signature required.</p>
            </div>
            <div className="ps-footer-right">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Payslip;
