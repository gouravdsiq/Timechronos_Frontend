import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import UnifiedLogin from './LoginPage/UnifiedLogin';
import AdminDashboard from './Dashboard/Admin';
import EmployeeDashboard from './Dashboard/Employee';
import AdminSignup from './Sign Up/AdminSignup';
import ForgotPassword from './Forgot Password/ForgotPassword';
import { ToastContainer } from 'react-toastify';

// Import Admin Dashboard child components
import EmployeeList from './Admin Panel/EmployeeList';
import ActiveProjects from './Admin Panel/ActiveModal';
import ActiveClient from './Admin Panel/ActiveClient';
import ProfileModal from './Admin Panel/ProfileModal';
import ManagerPage from './Admin Panel/Manager';
import Timesheet from './Admin Panel/Timesheet';
import ActiveTask from './Admin Panel/ActiveTask'

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
      
      {/* Admin Dashboard with nested routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />}>
        {/* Default dashboard content */}
        <Route index element={<AdminDashboard.DashboardContent />} />
        
        {/* Nested routes for Admin Dashboard */}
        <Route path="employee-list" element={<EmployeeList />} />
        <Route path="active-projects" element={<ActiveProjects />} />
        <Route path="client" element={<ActiveClient />} />
        <Route path="profile" element={<ProfileModal />} />
        <Route path="task" element={<ActiveTask/>} />
        <Route path="manager" element={<ManagerPage />} />
        <Route path="timesheet" element={<Timesheet />} />
      </Route>
      
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