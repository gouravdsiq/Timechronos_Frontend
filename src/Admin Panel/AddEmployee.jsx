import React, { useEffect, useState } from 'react';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee, initialData }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        position: initialData.position,
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        position: '',
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">{initialData ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{initialData ? 'Update Employee' : 'Add Employee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
