import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit, ArrowLeft } from 'lucide-react';
import axiosInstance from '../axios/config';
import { useSelector } from 'react-redux';

const ProfileModal = () => {
  const token = useSelector((state) => state.auth.access_token);
  const company_id = useSelector((state) => state.auth.company_id);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState({
    company_name: false,
    email_domain: false,
    contact_email: false,
    contact_number: false,
    address: false,
  });

  const [formData, setFormData] = useState({
    company_name: '',
    email_domain: '',
    contact_email: '',
    contact_number: '',
    address: '',
  });

  useEffect(() => {
    if (!token) {
      console.error('Access token is missing');
      return;
    }
    console.log("Access token being used:", token);

    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get(`/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const companyData = response.data.user;

        setFormData({
          company_name: companyData.name || '',
          email_domain: companyData.email_domain || '',
          contact_email: companyData.contact_email || '',
          contact_number: companyData.contact_number || '',
          address: companyData.address || '',
        });
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
  }, [token]);

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
      await axiosInstance.put(`/update-profile/${company_id}`, {
        name: formData.company_name,
        email_domain: formData.email_domain,
        contact_email: formData.contact_email,
        contact_number: formData.contact_number,
        address: formData.address,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      <div className="bg-indigo-700 px-4 py-3 shadow-md">
        <div className="w-full flex items-center text-white">
          <button
            onClick={handleCancel}
            className="mr-3 hover:text-indigo-200 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-wide">Admin Profile</h1>
        </div>
      </div>

      <div className="flex-grow w-full overflow-auto">
        <div className="w-full p-4 sm:p-6 lg:p-8 mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center mb-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-6xl font-extrabold shadow-md">
                    {formData.company_name ? formData.company_name.charAt(0).toUpperCase() : ''}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-indigo-50">
                    <Camera className="w-6 h-6 text-indigo-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <button className="mt-4 text-indigo-600 font-medium hover:text-indigo-800">
                  Change Company Logo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'company_name',
                  'email_domain',
                  'contact_email',
                  'contact_number',
                  'address',
                ].map((field) => (
                  <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                    <label htmlFor={field} className="block text-sm font-semibold text-gray-700 mb-2">
                      {{
                        contact_email: 'Contact Email',
                        contact_number: 'Contact Number',
                        email_domain: 'Email Domain',
                        company_name: 'Company Name',
                        address: 'Company Address',
                      }[field]}
                    </label>
                    <div className="flex items-center gap-3">
                      {isEditing[field] ? (
                        field === 'address' ? (
                          <textarea
                            id={field}
                            rows={4}
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-gray-900 resize-none shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          />
                        ) : (
                          <input
                            id={field}
                            type={
                              field.includes('email') ? 'email' :
                              field.includes('number') ? 'tel' : 'text'
                            }
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          />
                        )
                      ) : (
                        <div className="flex-1 py-3 px-4 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
                          {formData[field] || <span className="text-gray-400 italic">Not provided</span>}
                        </div>
                      )}
                      <button
                        onClick={() => toggleEdit(field)}
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700"
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
