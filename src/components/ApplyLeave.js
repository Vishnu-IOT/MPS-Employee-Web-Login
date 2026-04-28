import React, { useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { applyLeaveAPI } from '../helper.js/api';

function ApplyLeave() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 900;

  const [leave, setLeave] = useState({
    leave_date: '',
    duration: '',
    half_day: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLeave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();

    Object.keys(leave).forEach((key) => {
      submitData.append(key, leave[key]);
    });

    try {
      const response = await applyLeaveAPI(submitData);

      if (response.success) {
        alert(response.message || 'Leave Created successfully!');
        setLeave({
          leave_date: '',
          duration: '',
          half_day: '',
          reason: '',
        });
        navigate('/leave');
      } else {
        alert(response.message || 'Failed to create Leave');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const FormContent = (
    <div className="form-card modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => navigate('/leave')}>
        ×
      </button>

      <h2 className="form-title">Apply Leave</h2>

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            name="leave_date"
            value={leave.leave_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration</label>
          <select
            name="duration"
            value={leave.duration}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1">Full Day</option>
            <option value="0.5">Half Day</option>
          </select>
        </div>

        {leave.duration === '0.5' && (
          <div className="form-group">
            <label>Half Day</label>
            <select
              name="half_day"
              value={leave.half_day || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>
        )}

        <div className="form-group full-width">
          <label>Reason</label>
          <textarea
            name="reason"
            value={leave.reason}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="submit-btn">
            {loading ? 'Submitting...' : 'Submit Leave'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="permission-screen">
      {/* Header */}
      <div className="report-top">
        <div className="report-back">
          <button className="down-btn" onClick={() => navigate('/leave')}>
            <MdKeyboardArrowLeft />
          </button>
          <h3 style={{ fontWeight: 600, fontSize:'16px' }}>Apply Leave</h3>
        </div>
      </div>

      {/* Conditional Render */}
      {isMobile ? (
        <div className="mobile-form-wrapper">{FormContent}</div>
      ) : (
        <div className="dialog-overlays" onClick={() => navigate('/leave')}>
          {FormContent}
        </div>
      )}
    </div>
  );
}

export default ApplyLeave;
