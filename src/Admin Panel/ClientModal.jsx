import React, { useState, useEffect } from 'react';

const ClientModal = ({ isOpen, onClose, onSubmit, initialData, modalTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    code: '',
    // company_id: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        email: initialData?.email || '',
        code: initialData?.code || '',
        // company_id: initialData?.company_id || '',
        description: initialData?.description || '',
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, code, company_id, description } = formData;

    if (!name || !email || !code || !description) {
      alert('Please fill all fields.');
      return;
    }
    onSubmit({
      name,
      email,
      code,
    //   company_id: String(company_id),
      description,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">{modalTitle}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Client's full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="client@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Client code"
              required
            />
          </div>
          {/* <div>
            <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Company ID</label>
            <input
              id="company_id"
              name="company_id"
              type="text"
              value={formData.company_id}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Company ID"
              required
            />
          </div> */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description"
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
              {modalTitle.includes('Add') ? 'Add New Client' : 'Update Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;

