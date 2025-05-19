import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axios/config';
import { useNavigate } from 'react-router-dom';
import { showToast, TOAST_TYPES } from '../ToastMessage';
import { ComboBox } from '@progress/kendo-react-dropdowns';

const TimeChronosLogo = () => {
  return (
    <div className="flex justify-center mb-4">
      <img 
        src="/assets/Time Chronos Logo(Main).png" 
        alt="TimeChronos Logo" 
        className="h-20 w-auto object-contain"
      />
    </div>
  );
};

const AdminSignup = ({ switchView }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    email_domain: '',
    contact_email: '',
    contact_number: '',
    address: '',
    password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset status messages
    setError('');
    setSuccess(null);
    
    // Basic validation
    if (
      !formData.name || 
      !formData.industry || 
      !formData.contact_email || 
      !formData.password || 
      !formData.confirm_password
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Send company data to backend
      const response = await axiosInstance.post('company/register', formData);
      
      console.log('Company info saved:', response.data);
  
      // Clear form data
      setFormData({
        name: '',
        industry: '',
        email_domain: '',
        contact_email: '',
        contact_number: '',
        address: '',
        password: '',
        confirm_password: '',
      });
      
      // Display success message from the backend
      setSuccess({
        message: response.data.message || 'Registration successful! Welcome aboard!',
        companyId: response.data.company_id,
        adminUser: response.data.admin_user
      });
      
      // Show success toast and wait for it to complete before redirecting
      showToast(response.data.message || 'Registration successful! Welcome aboard!', TOAST_TYPES.SUCCESS);
      
      // Redirect after 5 seconds
      setTimeout(() => {
        navigate('/company/login');
      }, 5000);

    } catch (err) {
      console.error('Error saving company info:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save company information. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, TOAST_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/company/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f2eefc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <TimeChronosLogo />
        
        <div className="text-center mb-6 mt-0">
          <h1 className="text-3xl font-bold text-[#5A367D] mb-2">Company Registration</h1>
          <p className="text-[#9a8edf] mb-6">Please provide your company details</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            <p className="font-semibold">{success.message}</p>
            <p>Company ID: {success.companyId}</p>
            <p>Admin Email: {success.adminUser?.email}</p>
            <p className="mt-2 text-sm italic">Redirecting to login page in 5 seconds...</p>
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Your Company Name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Information Technology and Services"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email_domain" className="block text-sm font-medium text-gray-700 mb-1">
              Email Domain
            </label>
            <input
              type="text"
              id="email_domain"
              value={formData.email_domain}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="yourcompany.com"
            />
          </div>
          
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="contact@yourcompany.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="+1-555-123-4567"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="123 Business Drive, City, State, Country"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-medium rounded-md shadow-md transition duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#5A367D] text-white hover:bg-[#4a2e69]'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={handleBackToLogin} className="text-[#5A367D] hover:underline text-sm">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminSignup;