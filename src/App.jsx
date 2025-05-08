import React, { useState } from 'react';
import UnifiedLogin from './LoginPage/UnifiedLogin';
import AdminDashboard from './Dashboard/Admin';
import EmployeeDashboard from './Dashboard/Employee';
import AdminSignup from './Sign Up/AdminSignup';
import EmployeeSignup from './Sign Up/EmployeeSignup';
import ForgotPassword from './Forgot Password/ForgotPassword';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userRole, setUserRole] = useState(null);

  const switchView = (view) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setCurrentView(`${role}Dashboard`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <UnifiedLogin onLoginSuccess={handleLoginSuccess} />;
      case 'adminSignup':
        return <AdminSignup switchView={switchView} />;
      case 'employeeSignup':
        return <EmployeeSignup switchView={switchView} />;
      case 'forgotPassword':
        return <ForgotPassword switchView={switchView} />;
      case 'adminDashboard':
        return <AdminDashboard />;
      case 'employeeDashboard':
        return <EmployeeDashboard />;
      default:
        return <UnifiedLogin onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {renderView()}
    </div>
  );
}

export default App;
