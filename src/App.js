import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginScreen } from './components/login';
import { HomeScreen } from './components/home';
import { OverviewScreen } from './components/overview';
import ProfileScreen from './components/ProfileScreen';
import MonthlyReport from './components/MonthlyReport';
import Permission from './components/Permission';
import Leave from './components/Leave';
import RaiseTicket from './components/RaiseTicket';
import Holiday from './components/Holiday';
import LateDays from './components/LateDays';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import ApplyPermission from './components/ApplyPermission';
import ApplyRaiseTicket from './components/ApplyRaiseTicket';
import ApplyLeave from './components/ApplyLeave';
import DayAttendance from './components/DayAttendance';
import ChangePassword from './components/ChangePassword';
import { checkTokenExpiresAPI } from './helper.js/api';
import Notification from './components/Notification';
// import MainPage from './components/MainPage';
// import MonthOverview from './components/MonthOverview';
import SalaryReport from './components/SalaryReport';

function App() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        const res = await checkTokenExpiresAPI();
        if (res.status) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
  };

  const Layout = () => (
    <div className="main-layout">
      <Sidebar setUser={setUser} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginScreen setUser={setUser} />} />

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/attendance" element={<OverviewScreen />} />
          <Route
            path="/profile"
            element={<ProfileScreen setUser={setUser} />}
          />
          <Route path="/report" element={<MonthlyReport />} />
          <Route path="/permission" element={<Permission />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/ticket" element={<RaiseTicket />} />
          <Route path="/holiday" element={<Holiday />} />
          <Route path="/late" element={<LateDays />} />
          <Route path="/apply-permission" element={<ApplyPermission />} />
          <Route path="/apply-raiseticket" element={<ApplyRaiseTicket />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/attendance-details" element={<DayAttendance />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/notification" element={<Notification />} />
          {/* <Route path="/create-task" element={<MainPage />} />
          <Route path="/month-overview" element={<MonthOverview />} /> */}
          <Route path="/salary-payslip" element={<SalaryReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
