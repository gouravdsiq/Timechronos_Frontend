import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import UnifiedLogin from './LoginPage/UnifiedLogin';
import AdminDashboard from './Dashboard/Admin';
import EmployeeDashboard from './Dashboard/Employee';
import AdminSignup from './Sign Up/AdminSignup';
import EmployeeSignup from './Sign Up/EmployeeSignup';
import ForgotPassword from './Forgot Password/ForgotPassword';
import ProfileModal from './Admin Panel/ProfileModal';
import EmployeeList from '../src/Admin Panel/EmployeeList'
import ActiveProjects from './Admin Panel/ActiveModal';

import './App.css';

const AppRoutes = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (result) => {
    if (result === 'adminSignup') {
      navigate('/company-registration');
    } else if (result === 'employeeSignup') {
      navigate('/employee-signup');
    } else if (result === 'forgotPassword') {
      navigate('/forgot-password');
    } else if (result === 'admin') {
      navigate('/admin-dashboard');
    } else if (result === 'employee') {
      navigate('/employee-dashboard');
    } else {
      navigate('/');
    }
  };

  const switchView = (view) => {
    switch (view) {
      case 'dashboard':
        navigate('/');
        break;
      case 'adminSignup':
        navigate('/company-registration');
        break;
      case 'employeeSignup':
        navigate('/employee-signup');
        break;
      case 'forgotPassword':
        navigate('/forgot-password');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<UnifiedLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/company-registration" element={<AdminSignup switchView={switchView} />} />
      <Route path="/employee-signup" element={<EmployeeSignup switchView={switchView} />} />
      <Route path="/forgot-password" element={<ForgotPassword switchView={switchView} />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-dashboard/employee-list" element={< EmployeeList/>} />
      <Route path="/admin-dashboard/active-projects" element={<ActiveProjects />} />
      <Route path="/admin-dashboard/update-profile/:companyId" element={<ProfileModal />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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