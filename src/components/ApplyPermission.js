import React, { useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { applyPermissionAPI } from '../helper.js/api';

function ApplyPermission() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 900;

  const [permission, setPermission] = useState({
    attendance_date: '',
    start_time: '',
    end_time: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);

  const convertTo12HourFormat = (time) => {
    if (!time) return '';

    let [hour, minute] = time.split(':');

    hour = parseInt(hour, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPermission((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();

    submitData.append('attendance_date', permission.attendance_date);
    submitData.append(
      'start_time',
      convertTo12HourFormat(permission.start_time)
    );
    submitData.append('end_time', convertTo12HourFormat(permission.end_time));
    submitData.append('reason', permission.reason);

    try {
      const response = await applyPermissionAPI(submitData);

      if (response.success) {
        alert(response.message || 'Permission Created successfully!');
        navigate('/permission');
      } else {
        alert(response.message || 'Failed to create Permission');
      }
      navigate('/permission');
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const FormContent = (
    <div className="form-card modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => navigate('/permission')}>
        ×
      </button>

      <h2 className="form-title">Apply Permission</h2>

      <form className="registration-form">
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            name="attendance_date"
            value={permission.attendance_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            name="start_time"
            value={permission.start_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            name="end_time"
            value={permission.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Reason</label>
          <textarea
            name="reason"
            value={permission.reason}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            {loading ? 'Submitting...' : 'Submit Permission'}
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
          <button className="down-btn" onClick={() => navigate('/permission')}>
            <MdKeyboardArrowLeft />
          </button>
          <h3 style={{ fontWeight: 600, fontSize:'16px' }}>Apply Permission</h3>
        </div>
      </div>

      {/* Conditional Render */}
      {isMobile ? (
        <div className="mobile-form-wrapper">{FormContent}</div>
      ) : (
        <div
          className="dialog-overlays"
          onClick={() => navigate('/permission')}
        >
          {FormContent}
        </div>
      )}
    </div>
  );
}

export default ApplyPermission;
