import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/config';

// Modal component for adding or editing a client
const ClientModal = ({ isOpen, onClose, onSubmit, initialData, modalTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    company_id: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        name: '',
        code: '',
        company_id: '',
        description: '',
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, code, company_id, description } = formData;
    if (!name || !code || !company_id || !description) {
      alert('Please fill all fields.');
      return;
    }
    onSubmit({
      ...formData,
      company_id: Number(company_id), // ensure company_id is a number
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
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Client's full name"
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
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Client code"
            />
          </div>
          <div>
            <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Company ID</label>
            <input
              id="company_id"
              name="company_id"
              type="number"
              min="1"
              value={formData.company_id}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Company ID"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description"
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

const ActiveClient = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/client');
        const data = response.data.clients || response.data || [];
        setClients(data);
      } catch (err) {
        setError('Failed to fetch clients from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    if (filter === 'active') return client.status === 'Active';
    if (filter === 'inactive') return client.status === 'Inactive';
    return true;
  });

  const handleAddClient = async (newClient) => {
    try {
      const response = await axiosInstance.post('/client/add', newClient);
      if (response.data.message) {
        const createdClient = response.data.client || {
          id: clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1,
          ...newClient
        };
        setClients(prev => [...prev, createdClient]);
        alert(response.data.message);
        setIsAddModalOpen(false);
      } else {
        alert('Add client failed: No confirmation message received.');
      }
    } catch (error) {
      alert('Add client failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditClient = async (updatedClient) => {
  if (!clientToEdit) return;
  const payload = {
    client: {
      id: clientToEdit.id,
      name: updatedClient.name,
      code: updatedClient.code || '',
      company_id: updatedClient.company_id || 0,
      description: updatedClient.description || '',
    }
  };
  try {
    const response = await axiosInstance.put(`/client/update/${clientToEdit.id}`, payload);
    if (response.data.message) {
      // Update the local state with the new client data
      setClients(prev =>
        prev.map(c => (c.id === clientToEdit.id ? { ...c, ...updatedClient } : c))
      );
      alert(response.data.message);
      setIsEditModalOpen(false);
      setClientToEdit(null);
    } else {
      alert('Update failed: No confirmation message received.');
    }
  } catch (error) {
    alert('Update failed: ' + (error.response?.data?.message || error.message));
  }
};

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await axiosInstance.post('/client/delete', { client_id: clientId });
      if (response.data.message) {
        setClients(prev => prev.filter(client => client.id !== clientId));
        alert(response.data.message);
      } else {
        alert('Delete failed: No confirmation message received.');
      }
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen relative max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Client List</h1>

      <div className="bg-white rounded-lg shadow-lg p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">All Clients</h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add New Client
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md mr-2 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            Total Clients
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Code</th>
                <th className="py-2 px-4 border-b text-left">Company ID</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="py-2 px-4 border-b">{client.name}</td>
                  <td className="py-2 px-4 border-b">{client.code || '-'}</td>
                  <td className="py-2 px-4 border-b">{client.company_id || '-'}</td>
                  <td className="py-2 px-4 border-b">{client.description || '-'}</td>
                  <td className="py-2 px-4 border-b flex space-x-3">
                    <button
                      onClick={() => {
                        setClientToEdit(client);
                        setIsEditModalOpen(true);
                      }}
                      title="Edit Client"
                      className="p-1 rounded-md text-blue-600 hover:bg-blue-100 transition duration-200"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      title="Delete Client"
                      className="p-1 rounded-md text-red-600 hover:bg-red-100 transition duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <ClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClient}
        modalTitle="Add New Client"
      />

      {/* Edit Client Modal */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setClientToEdit(null);
        }}
        onSubmit={handleEditClient}
        initialData={clientToEdit}
        modalTitle="Edit Client"
      />
    </div>
  );
};

export default ActiveClient;
