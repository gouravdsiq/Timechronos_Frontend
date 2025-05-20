import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddEmployeeModal from '../Admin Panel/AddEmployee'
import axiosInstance from '../axios/config';
import { useSelector } from 'react-redux';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.access_token);
  // Fetch employees data from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        
        
        const response = await axiosInstance.get(`user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
      
        const formattedEmployees = data.map(employee => ({
          id: employee.id,
          name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
          email: employee.email || '',
          position: employee.role || '',
          status: employee.role ? 'Active' : 'Inactive' // Assuming if role exists, employee is active
        }));
        
        setEmployees(formattedEmployees);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    if (filter === 'active') return employee.status === 'Active';
    if (filter === 'inactive') return employee.status === 'Inactive';
    return true;
  });

  const handleAddEmployee = async (newEmployee) => {
    try {
      
      // Format the employee data as required by your API
      const employeeData = {
        first_name: newEmployee.first_name || newEmployee.name.split(' ')[0],
        last_name: newEmployee.last_name || newEmployee.name.split(' ').slice(1).join(' '),
        email: newEmployee.email,
        role: newEmployee.position || '',
        // Add any other required fields
      };
      
      // Send the data to the backend
      await axiosInstance.post('user/create', employeeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the employee list after successful creation
      const response = await axiosInstance.get('user/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = response.data;
      const formattedEmployees = data.map(employee => ({
        id: employee.id,
        name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
        email: employee.email || '',
        position: employee.role || '',
        status: employee.role ? 'Active' : 'Inactive'
      }));
      
      setEmployees(formattedEmployees);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee. Please try again.');
    }
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 h-screen relative" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Employee List</h1>

      <div className="bg-white rounded-lg shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">All Employees</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add New Employee
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md mr-2 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            Total Employees
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md mr-2 ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            Active Employees
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-md ${filter === 'inactive' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
          >
            Inactive Employees
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading employees...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">Error: {error}</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Position</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="py-2 px-4 border-b">{employee.name}</td>
                    <td className="py-2 px-4 border-b">{employee.email}</td>
                    <td className="py-2 px-4 border-b">{employee.position || '-'}</td>
                    <td className={`py-2 px-4 border-b ${employee.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                      {employee.status || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
};

export default EmployeeList;