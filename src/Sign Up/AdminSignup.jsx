import React, { useState } from 'react';
import axiosInstance from '../axios/config';

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
    admin_code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    
    // Basic validation
    if (
      !formData.name || 
      !formData.industry || 
      !formData.contact_email || 
      !formData.password || 
      !formData.confirm_password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Send company data to backend
      const response = await axiosInstance.post('/company-registration', formData);
      
      console.log('Company info saved:', response.data);
      setSuccess('Company information saved successfully!');

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
        admin_code: ''
      });
      
    } catch (err) {
      console.error('Error saving company info:', err);
      setError(
        err.response?.data?.message || 
        'Failed to save company information. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Information</h1>
        <p className="text-gray-600 mb-6">Please provide your company details</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {success}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mediaAMP"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mediaamp.com"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contact@mediaamp.com"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Innovation Drive, Silicon Valley, CA, USA"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => switchView && switchView('dashboard')} className="text-blue-600 hover:underline text-sm">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
