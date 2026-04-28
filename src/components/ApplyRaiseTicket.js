import React, { useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { raiseTicketAPI } from '../helper.js/api';

function ApplyRaiseTicket() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 900;

  const [raiseTicket, setRaiseTicket] = useState({
    date: '',
    time: '',
    type: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRaiseTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    const user = JSON.parse(localStorage.getItem('user'));

    Object.keys(raiseTicket).forEach((key) => {
      submitData.append(key, raiseTicket[key]);
    });

    submitData.append('user_id', user.id);

    try {
      const response = await raiseTicketAPI(submitData);

      if (response.success) {
        alert(response.message || 'Ticket Created successfully!');
        navigate('/ticket');
      } else {
        alert(response.message || 'Failed to create Ticket');
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
      <button className="close-btn" onClick={() => navigate('/ticket')}>
        ×
      </button>

      <h2 className="form-title">Raise Ticket</h2>

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={raiseTicket.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={raiseTicket.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select name="type" value={raiseTicket.type} onChange={handleChange}>
            <option value="">Select</option>
            <option value="clock_in">Check In</option>
            <option value="clock_out">Check Out</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Reason</label>
          <textarea
            name="reason"
            value={raiseTicket.reason}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="submit-btn">
            {loading ? 'Submitting...' : 'Raise Ticket'}
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
          <button className="down-btn" onClick={() => navigate('/ticket')}>
            <MdKeyboardArrowLeft />
          </button>
          <h3 style={{ fontWeight: 600, fontSize:'16px' }}>Raise Ticket</h3>
        </div>
      </div>

      {/* Conditional Render */}
      {isMobile ? (
        <div className="mobile-form-wrapper">{FormContent}</div>
      ) : (
        <div className="dialog-overlays" onClick={() => navigate('/ticket')}>
          {FormContent}
        </div>
      )}
    </div>
  );
}

export default ApplyRaiseTicket;
