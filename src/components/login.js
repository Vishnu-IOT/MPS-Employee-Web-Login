import { useState } from 'react';
import { forgetPasswordAPI, loginAPI } from '../helper.js/api';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ===== LOGIN SCREEN =====
export const LoginScreen = ({ setUser }) => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credLogin, setCredLogin] = useState({
    email: '',
    password: '',
  });
  const [credPassword, setCredPassword] = useState({
    email: '',
  });
  const [login, setLogin] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePassword = (e) => {
    const { name, value } = e.target;
    setCredPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAPI(credLogin);

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/home');
      } else {
        alert('Invalid credentials');
      }
      setCredLogin({
        email: '',
        password: '',
      });
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGetPassword = async () => {
    try {
      const data = await forgetPasswordAPI(credPassword);

      if (data && data.token) {
        // // ✅ Store token (for future API calls)
        // localStorage.setItem('token', data.token);
        // // ✅ Store user info (optional)
        // localStorage.setItem('user', JSON.stringify(data.user));
        // // ✅ Update App state
        // onLogin(data.user);
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="app-shell">
      <div className="login-screen">
        <div className="login-header">
          <div className="mk-logo">
            <img src={logo} alt="logo" />
          </div>
          <h1>Get Started now</h1>
          <p>Create an account or log in to explore about our app</p>
        </div>
        {login ? (
          <div className="login-body">
            <h2>Sign In</h2>
            <p className="signin-sub">Sign in to my account</p>
            <div className="field-group">
              <label>Email / Employee ID</label>
              <input
                name="email"
                type="text"
                placeholder="Enter your email/EMPID"
                value={credLogin.email}
                onChange={handleChange}
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <div className="password-wrap">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  value={credLogin.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  <EyeOffIcon />
                </button>
              </div>
              <p className="forgot-link" onClick={() => setLogin(false)}>
                Forgot Password
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        ) : (
          <div className="login-body">
            <h2>Get Password</h2>
            <p className="signin-sub">Sign in to my account</p>
            <div className="field-group">
              <label>Email / Employee ID</label>
              <input
                name="email"
                type="text"
                placeholder="Enter your email/EMPID"
                value={credPassword.email}
                onChange={handlePassword}
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                handleGetPassword();
                setLogin(true);
              }}
            >
              Get Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
