import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axios/config';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ComboBox } from '@progress/kendo-react-dropdowns';

const AdminSignup = ({ switchView }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    email_domain: '',
    contact_email: '',
    contact_number: '',
    address: '',
    country: '',
    password: '',
    confirm_password: '',
    admin_code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Countries dropdown state
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Load countries on component mount
  useEffect(() => {
    // This is a list of common countries - you can replace with an API call
    const countryList = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
      "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
      "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
      "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
      "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
      "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
      "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
      "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", 
      "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
      "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
      "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
      "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
      "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
      "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", 
      "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
      "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
      "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
      "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", 
      "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", 
      "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
      "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", 
      "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
      "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
      "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
      "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
      "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
      "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", 
      "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
      "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
      "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
      "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
      "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", 
      "Zambia", "Zimbabwe"
    ];
    
    setCountries(countryList);
    setFilteredCountries(countryList);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle country search
  const handleCountrySearch = (e) => {
    const query = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      country: query
    }));
    
    const filtered = countries.filter(country => 
      country.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCountries(filtered);
    
    // Show dropdown when typing
    if (!showDropdown && query) {
      setShowDropdown(true);
    }
  };

  // Handle country selection
  const selectCountry = (country) => {
    setFormData(prev => ({
      ...prev,
      country: country
    }));
    setShowDropdown(false);
    setFilteredCountries(countries);
  };

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
    
    // Basic validation
    if (
      !formData.name || 
      !formData.industry || 
      !formData.contact_email || 
      !formData.country ||
      !formData.password || 
      !formData.confirm_password
    ) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🚫"
      });
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      toast.error('Passwords do not match', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🔒"
      });
      return;
    }
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Send company data to backend
      const response = await axiosInstance.post('company/registration', formData);
      
      console.log('Company info saved:', response.data);
      
      // Clear form data
      setFormData({
        name: '',
        industry: '',
        email_domain: '',
        contact_email: '',
        contact_number: '',
        address: '',
        country: '',
        password: '',
        confirm_password: '',
        admin_code: ''
      });
      
      // Show success toast and wait for it to complete before redirecting
      toast.success('Registration successful! Welcome aboard! 🎉', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "✅",
        onClose: () => {
          navigate('/login');
        }
      });

    } catch (err) {
      console.error('Error saving company info:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save company information. Please try again.';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "❌"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />
      
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Information</h1>
        <p className="text-gray-600 mb-6">Please provide your company details</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
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
          
          {/* Country Dropdown with Search */}
          <div className="relative" ref={dropdownRef}>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={handleCountrySearch}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search and select a country"
                required
              />
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                      onClick={() => selectCountry(country)}
                    >
                      {country}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">No countries found</div>
                )}
              </div>
            )}
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
          <button onClick={handleBackToLogin} className="text-blue-600 hover:underline text-sm">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;