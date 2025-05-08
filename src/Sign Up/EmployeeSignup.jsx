// components/EmployeeSignup.js
import React, { useState } from 'react';

const EmployeeSignup = ({ switchView }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: '',
    inviteCode: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    console.log('Employee signup attempt:', formData);
    // Add registration logic here
  };

  return (
    <div className="w-full max-w-md">
      <div className="mt-6 text-center">
        <span className="text-gray-600 text-sm">Already have an account? </span>
        <button onClick={() => switchView('ogin')} className="text-blue-600 hover:underline text-sm">
          Log In
        </button>
      </div>
    </div>
  );
};

export default EmployeeSignup;