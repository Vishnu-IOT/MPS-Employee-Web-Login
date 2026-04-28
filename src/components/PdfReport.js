import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function PdfReport(data) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(14);
  doc.text('Monthly Attendance Report', 105, 20, { align: 'center' });

  // Table Columns
  const columns = ['Date', 'In', 'Out', 'Late', 'Type'];

  // Table Rows
  const rows = data.map((item) => [
    item.date,
    item.check_in || '-:--:--',
    item.check_out || '-:--:--',
    item.late_checkin ? item.late_checkin_time : 'No',
    item.type,
  ]);

  // Table
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 0,
    },
  });

  doc.text(`Page 1`, 180, 290);

  // Save PDF
  doc.save('attendance_report.pdf');
}

export default PdfReport;
