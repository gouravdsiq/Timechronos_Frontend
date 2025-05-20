import React, { useState, useEffect } from 'react';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    joiningDate: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        position: '',
        joiningDate: '',
        email: '',
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, position, joiningDate, email } = formData;
    if (!name || !position || !joiningDate || !email) {
      alert('Please fill all fields.');
      return;
    }
    onAddEmployee(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h3 className="text-xl font-semibold mb-4">Add New Employee</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
              Joining Date
            </label>
            <input
              id="joiningDate"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              Add New Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;


