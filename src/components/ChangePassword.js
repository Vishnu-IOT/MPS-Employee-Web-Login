import React, { useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { changePasswordAPI } from '../helper.js/api';

function ChangePassword() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 900;

  const [changePassword, setChangePassword] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    const submitData = new FormData();

    Object.keys(changePassword).forEach((key) => {
      submitData.append(key, changePassword[key]);
    });

    submitData.append('email', user.email);

    try {
      const response = await changePasswordAPI(submitData);

      if (response.success) {
        alert(response.message || 'Password Changed successfully!');
        setChangePassword({
          old_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
        navigate('/profile');
      } else {
        alert(response.message || 'Failed to change Password');
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
      <button className="close-btn" onClick={() => navigate('/profile')}>
        ×
      </button>

      <h2 className="form-title">Change Password</h2>

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="text"
            name="old_password"
            value={changePassword.old_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="text"
            name="new_password"
            value={changePassword.new_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="text"
            name="new_password_confirmation"
            value={changePassword.new_password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="submit-btn">
            {loading ? 'Submitting...' : 'Change Password'}
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
          <button className="down-btn" onClick={() => navigate('/profile')}>
            <MdKeyboardArrowLeft />
          </button>
          <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Change Password</h3>
        </div>
      </div>

      {/* Conditional Render */}
      {isMobile ? (
        <div className="mobile-form-wrapper">{FormContent}</div>
      ) : (
        <div className="dialog-overlays" onClick={() => navigate('/profile')}>
          {FormContent}
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
