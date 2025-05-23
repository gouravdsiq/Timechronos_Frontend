import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios/config';
import { useNavigate } from 'react-router-dom';
import { showToast, TOAST_TYPES } from '../ToastMessage';

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
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    industry: '',
    contact_number: '',
    address: '',
    country_id: ''
  });
  
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Mock countries data - replace with actual API call
  useEffect(() => {
    // You should replace this with your actual countries API call
    const mockCountries = [
      { id: 'f826a65f-b28a-4b58-85b6-ec0f58912d93', name: 'India' },
      { id: 'a123b456-c789-4def-9012-345678901234', name: 'United States' },
      { id: 'b234c567-d890-4ef1-2345-678901234567', name: 'United Kingdom' },
      { id: 'c345d678-e901-4f23-4567-890123456789', name: 'Canada' },
      { id: 'd456e789-f012-4345-6789-012345678901', name: 'Australia' }
    ];
    setCountries(mockCountries);
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    
    // Required field validation
    if (
      !formData.name || 
      !formData.first_name || 
      !formData.last_name || 
      !formData.email || 
      !formData.password || 
      !formData.confirm_password ||
      !formData.country_id
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API - exclude confirm_password
      const { confirm_password, ...apiData } = formData;
      
      const response = await axiosInstance.post('/v1/register-company', apiData);
      
      console.log('Company registration successful:', response.data);
  
      // Clear form data
      setFormData({
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        industry: '',
        contact_number: '',
        address: '',
        country_id: ''
      });
      
      setSuccess({
        message: response.data.message || 'Registration successful! Welcome aboard!',
        companyId: response.data.company_id,
        adminUser: response.data.admin_user
      });
      
      showToast(response.data.message || 'Registration successful! Welcome aboard!', TOAST_TYPES.SUCCESS);
      
      // Redirect after 5 seconds
      setTimeout(() => {
        navigate('/company/login');
      }, 5000);

    } catch (err) {
      console.error('Error during company registration:', err);
      const errorMessage = err.response?.data?.message || 'Failed to register company. Please try again.';
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f2eefc] py-3 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
            {success.companyId && <p>Company ID: {success.companyId}</p>}
            {success.adminUser?.email && <p>Admin Email: {success.adminUser?.email}</p>}
            <p className="mt-2 text-sm italic">Redirecting to login page in 5 seconds...</p>
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
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
          <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Your First Name"
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Your Last Name"
              required
            />
          </div>
          </div>
          <div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="your.email@company.com"
              required
            />
          </div>
          
          <div>
            <select
              id="country_id"
              value={formData.country_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          
          <div>
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
          
          <div>
            <input
              type="text"
              id="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="Information Technology and Services"
            />
          </div>
          
          <div>
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
            <textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              placeholder="123 Business Drive, City, State, Country"
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