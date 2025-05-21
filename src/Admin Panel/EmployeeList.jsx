import React, { useState, useEffect, useMemo } from 'react';
import { Users, ArrowLeft, Edit, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddEmployeeModal from '../Admin Panel/AddEmployee';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import '@progress/kendo-theme-default/dist/all.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [gridState, setGridState] = useState({}); // State management for Grid
  const navigate = useNavigate();

  // Sample employee data
  const sampleEmployees = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      role: 'Developer',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      role: 'Designer',
    },
    {
      id: 3,
      first_name: 'Alice',
      last_name: 'Johnson',
      email: 'alice.johnson@example.com',
      role: 'Manager',
    },
    {
      id: 4,
      first_name: 'Bob',
      last_name: 'Brown',
      email: 'bob.brown@example.com',
      role: '',
    },
  ];

  useEffect(() => {
    setLoading(true);
    try {
      // Simulate loading delay
      setTimeout(() => {
        const formattedEmployees = sampleEmployees.map(employee => ({
          id: employee.id,
          name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
          email: employee.email || '',
          position: employee.role || '',
          status: employee.role ? 'Active' : 'Inactive'
        }));

        setEmployees(formattedEmployees);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load employees');
      setLoading(false);
    }
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      if (filter === 'active') return employee.status === 'Active';
      if (filter === 'inactive') return employee.status === 'Inactive';
      return true;
    });
  }, [employees, filter]);

  const handleAddEmployee = async (newEmployee) => {
    try {
      const employeeData = {
        first_name: newEmployee.first_name || newEmployee.name.split(' ')[0],
        last_name: newEmployee.last_name || newEmployee.name.split(' ').slice(1).join(' '),
        email: newEmployee.email,
        role: newEmployee.position || '',
      };

      const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      const formattedEmployee = {
        id: newId,
        name: `${employeeData.first_name} ${employeeData.last_name}`,
        email: employeeData.email,
        position: employeeData.role,
        status: employeeData.role ? 'Active' : 'Inactive',
      };

      setEmployees(prev => [...prev, formattedEmployee]);
      alert('Employee added successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee. Please try again.');
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      const employeeData = {
        first_name: updatedEmployee.first_name || updatedEmployee.name.split(' ')[0],
        last_name: updatedEmployee.last_name || updatedEmployee.name.split(' ').slice(1).join(' '),
        email: updatedEmployee.email,
        role: updatedEmployee.position || '',
      };

      setEmployees(prev =>
        prev.map(emp =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: `${employeeData.first_name} ${employeeData.last_name}`,
                email: employeeData.email,
                position: employeeData.role,
                status: employeeData.role ? 'Active' : 'Inactive',
              }
            : emp
        )
      );

      alert('Employee updated successfully!');
      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee. Please try again.');
    }
  };

  const handleArchiveEmployee = (employeeId) => {
    if (!window.confirm('Are you sure you want to archive this employee?')) return;
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    alert('Employee archived successfully!');
  };

  // Custom cell for actions with Edit and Archive buttons
  const ActionsCell = (props) => (
    <td>
      <div className="flex space-x-3">
        <button
          onClick={() => handleEditEmployee(props.dataItem)}
          title="Edit Employee"
          className="p-1 rounded-md text-blue-600 hover:bg-blue-100 transition duration-200"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleArchiveEmployee(props.dataItem.id)}
          title="Archive Employee"
          className="p-1 rounded-md text-yellow-600 hover:bg-yellow-100 transition duration-200"
        >
          <Archive className="w-5 h-5" />
        </button>
      </div>
    </td>
  );

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
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
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
          <Grid
            data={process(filteredEmployees, gridState)} // Process the filtered employees
            pageable
            sortable
            filterable
            style={{ height: '400px' }}
            onDataStateChange={e => setGridState(e.dataState)} // Update grid state on data state change
          >
            <Column field="name" title="Name" />
            <Column field="email" title="Email" />
            <Column field="position" title="Position" />
            <Column field="status" title="Status" cell={(props) => (
              <td className={`${props.dataItem.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                {props.dataItem.status}
              </td>
            )} />
            <Column
              title="Actions"
              width="120px"
              filterable={false}
              cell={ActionsCell}
            />
          </Grid>
        )}
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onAddEmployee={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        initialData={editingEmployee}
      />
    </div>
  );
};

export default EmployeeList;
