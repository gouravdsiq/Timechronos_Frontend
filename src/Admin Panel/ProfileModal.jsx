import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Edit, ArrowLeft } from 'lucide-react';
import axiosInstance from '../axios/config';

const ProfileModal = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState({
    name: false,
    emailDomain: false,
    contactEmail: false,
    contactNumber: false,
    address: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    emailDomain: '',
    contactEmail: '',
    contactNumber: '',
    address: '',
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        // console.log(token); // Retrieve the access token
        const response = await axiosInstance.get(`/admin`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
          },
        });
        const companyData = response.data.company;
        setFormData({
          name: companyData.name || '',
          emailDomain: companyData.email_domain || '',
          contactEmail: companyData.contact_email || '',
          contactNumber: companyData.contact_number || '',
          address: companyData.address || '',
        });
        // console.log(companyData.name);
      } catch (error) {
        
        if (error.response) {
          console.error('Error fetching company data:', error.response.data);
          console.error('Status code:', error.response.status);
        } else {
          console.error('Error fetching company data:', error.message);
        }
      }
    };
  
    fetchCompanyData();
  }, [companyId]);
  
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveAll = async () => {
    try {
      const token = localStorage.getItem('access_token'); // Retrieve the access token
      await axiosInstance.put(`/admin`, {
        name: formData.name,
        email_domain: formData.emailDomain,
        contact_email: formData.contactEmail,
        contact_number: formData.contactNumber,
        address: formData.address,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      });
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error saving company data:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen w-screen">
      {/* Header */}
      <div className="bg-indigo-700 px-4 py-3 shadow-md">
        <div className="w-full flex items-center">
          <div className="flex items-center text-white">
            <button
              onClick={handleCancel}
              className="mr-3 hover:text-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold tracking-wide">Admin Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow w-full overflow-auto">
        <div className="w-full p-4 sm:p-6 lg:p-8 mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full">
            <div className="p-6 sm:p-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-6xl font-extrabold shadow-md">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : ''}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-indigo-50 transition-colors">
                    <Camera className="w-6 h-6 text-indigo-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 focus:outline-none focus:underline"
                >
                  Change Company Logo
                </button>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['name', 'emailDomain', 'contactEmail', 'contactNumber', 'address'].map((field) => (
                  <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                    <label htmlFor={field} className="block text-sm font-semibold text-gray-700 mb-2">
                      {{
                        contactEmail: 'Contact Email',
                        contactNumber: 'Contact Number',
                        emailDomain: 'Email Domain',
                        name: 'Company Name',
                        address: 'Company Address',
                      }[field]}
                    </label>
                    <div className="flex items-center gap-3">
                      {isEditing[field] ? (
                        field === 'address' ? (
                          <textarea
                            id={field}
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-sm"
                            value={formData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            rows={4}
                            placeholder="Enter company address..."
                          />
                        ) : (
                          <input
                            id={field}
                            type={
                              field.toLowerCase().includes('email')
                                ? 'email'
                                : field.toLowerCase().includes('number')
                                ? 'tel'
                                : 'text'
                            }
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            value={formData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder={`Enter ${
                              field === 'name'
                                ? 'company name'
                                : field.replace(/([A-Z])/g, ' $1').toLowerCase()
                            }`}
                          />
                        )
                      ) : (
                        <div
                          id={field}
                          className="flex-1 py-3 px-4 bg-gray-50 rounded-md border border-gray-200 text-gray-700 select-text min-h-[44px] flex items-center"
                        >
                          {formData[field] || (
                            <span className="text-gray-400 italic">Not provided</span>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => toggleEdit(field)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                        aria-label={`Edit ${field}`}
                        type="button"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-10 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  type="button"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
