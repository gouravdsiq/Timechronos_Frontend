import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft, Edit, Archive } from 'lucide-react'; // Changed Edit2 to Edit and added Archive
import { useNavigate } from 'react-router-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import '@progress/kendo-theme-default/dist/all.css';

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
      name,
      code,
      company_id: Number(company_id),
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
  const [gridState, setGridState] = useState({
    sort: [{ field: 'name', dir: 'asc' }],
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  });

  const navigate = useNavigate();

  // Sample client data
  const sampleClients = [
    {
      id: 1,
      name: 'Acme Corporation',
      code: 'ACME001',
      company_id: 101,
      description: 'Global technology solutions provider',
      status: 'Active'
    },
    {
      id: 2,
      name: 'TechStart Inc',
      code: 'TECH002',
      company_id: 102,
      description: 'Startup technology consulting firm',
      status: 'Active'
    },
    {
      id: 3,
      name: 'RetailPlus',
      code: 'RETP003',
      company_id: 103,
      description: 'Retail chain management company',
      status: 'Active'
    },
    {
      id: 4,
      name: 'GlobalFinance',
      code: 'GFIN004',
      company_id: 104,
      description: 'Financial services provider',
      status: 'Inactive'
    },
    {
      id: 5,
      name: 'HealthCare Systems',
      code: 'HCSY005',
      company_id: 105,
      description: 'Healthcare management solutions',
      status: 'Active'
    }
  ];

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        setTimeout(() => {
          setClients(sampleClients);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch clients from backend');
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

  const processedData = process(filteredClients, gridState);

  const handleAddClient = async (newClient) => {
    try {
      // Create a new client with a generated ID
      const createdClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        ...newClient,
        status: 'Active'
      };
      
      setClients(prev => [...prev, createdClient]);
      alert('Client added successfully!');
      setIsAddModalOpen(false);
    } catch (error) {
      alert('Add client failed: ' + error.message);
    }
  };

  const handleEditClient = async (updatedClient) => {
    if (!clientToEdit) return;
    
    try {
      // Update the client in the local state
      setClients(prev =>
        prev.map(c => (c.id === clientToEdit.id ? { ...c, ...updatedClient } : c))
      );
      alert('Client updated successfully!');
      setIsEditModalOpen(false);
      setClientToEdit(null);
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  const handleArchiveClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to archive this client?')) return;

    try {
      // Remove the client from the local state
      setClients(prev => prev.filter(client => client.id !== clientId));
      alert('Client archived successfully!');
    } catch (error) {
      alert('Archive failed: ' + error.message);
    }
  };

  // Custom cell for actions
  const ActionsCell = (props) => {
    return (
      <td>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setClientToEdit(props.dataItem);
              setIsEditModalOpen(true);
            }}
            title="Edit Client"
            className="p-1 rounded-md text-blue-600 hover:bg-blue-100 transition duration-200"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleArchiveClient(props.dataItem.id)}
            title="Archive Client"
            className="p-1 rounded-md text-yellow-600 hover:bg-yellow-100 transition duration-200"
          >
            <Archive className="w-5 h-5" />
          </button>
        </div>
      </td>
    );
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
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
       <button
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
              <span>Back to Dashboard</span>
            </button>

      <h1 className="text-2xl font-bold mb-4">Client List</h1>

      <div className="bg-white rounded-lg shadow-lg p-5 flex-grow">
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
            All Clients
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md mr-2 ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            Active Clients
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-md mr-2 ${filter === 'inactive' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            Inactive Clients
          </button>
        </div>

        <Grid
          data={processedData}
          pageable
          sortable
          filterable
          style={{ height: '400px' }}
          onDataStateChange={(e) => setGridState(e.dataState)}
          {...gridState}
        >
          <Column field="name" title="Name" />
          <Column field="code" title="Code" />
          <Column field="company_id" title="Company ID" />
          <Column field="description" title="Description" />
          <Column 
            title="Actions" 
            width="120px"
            filterable={false}
            cell={ActionsCell} 
          />
        </Grid>
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
