import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import UnifiedLogin from './LoginPage/UnifiedLogin';
import AdminDashboard from './Dashboard/Admin';
import EmployeeDashboard from './Dashboard/Employee';
import AdminSignup from './Sign Up/AdminSignup';
import ForgotPassword from './Forgot Password/ForgotPassword';
import ProfileModal from './Admin Panel/ProfileModal';
import EmployeeList from './Admin Panel/EmployeeList';
import ActiveClient from './Admin Panel/ActiveClient';
import ActiveProjects from './Admin Panel/ActiveModal';
import ManagerPage from './Admin Panel/Manager';
import Timesheet from './Admin Panel/Timesheet';
import { ToastContainer } from 'react-toastify';

import './App.css';

const AppRoutes = () => {
  const navigate = useNavigate();

  const handleNavigation = (result) => {
    const routes = {
      adminSignup: '/company/registration',
      forgotPassword: 'company/forgot-password',
      admin: '/admin-dashboard',
      employee: '/employee-dashboard',
    };
    navigate(routes[result] || 'company/login');
  };

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path="company/login" element={<UnifiedLogin onLoginSuccess={handleNavigation} />} />
      <Route path="company/registration" element={<AdminSignup />} />
      <Route path="company/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-dashboard/employee-list" element={<EmployeeList />} />
      <Route path="/admin-dashboard/active-projects" element={<ActiveProjects />} />
      <Route path="/admin-dashboard/client" element={<ActiveClient />} />
      <Route path="/admin-dashboard/profile" element={<ProfileModal />} />
      <Route path="/admin-dashboard/task" element={<ManagerPage />} />
      <Route path="/admin-dashboard/manager" element={<ManagerPage />} />
      <Route path="/admin-dashboard/timesheet" element={<Timesheet />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="*" element={<Navigate to="company/login" replace />} />
    </Routes>
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
