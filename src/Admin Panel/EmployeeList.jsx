import React, { useState } from 'react';
import { Users, ArrowLeft } from 'lucide-react'; // Import the ArrowLeft icon
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  // Sample employees data
  const employees = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', position: 'Web Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', position: 'UX Designer', status: 'Inactive' },
    { id: 3, name: 'Michael Brown', email: 'michaelbrown@example.com', position: 'Project Manager', status: 'Active' },
    { id: 4, name: 'Emily Clark', email: 'emilyclark@example.com', position: 'Software Engineer', status: 'Active' },
    // Add more employees as needed
  ];

  const [filter, setFilter] = useState('all'); // State to manage the filter
  const navigate = useNavigate(); // Hook to navigate

  // Function to filter employees based on the selected filter
  const filteredEmployees = employees.filter((employee) => {
    if (filter === 'active') return employee.status === 'Active';
    if (filter === 'inactive') return employee.status === 'Inactive';
    return true; // Show all employees
  });

  return (
    <div className="flex flex-col p-6 bg-gray-50 h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin-dashboard')} // Navigate to the main dashboard
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" /> {/* Back arrow icon */}
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <div className="bg-white rounded-lg shadow-lg p-5">
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">All Employees</h2>
        </div>

        {/* Toggle Buttons */}
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

        {/* Employee Table */}
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
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition duration-200">
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">{employee.position}</td>
                <td className={`py-2 px-4 border-b ${employee.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                  {employee.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
