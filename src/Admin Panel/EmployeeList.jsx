import React from 'react';
import { Users } from 'lucide-react';

const EmployeeList = () => {
  // Sample employees data
  const employees = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', position: 'Web Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', position: 'UX Designer', status: 'Inactive' },
    { id: 3, name: 'Michael Brown', email: 'michaelbrown@example.com', position: 'Project Manager', status: 'Active' },
    { id: 4, name: 'Emily Clark', email: 'emilyclark@example.com', position: 'Software Engineer', status: 'Active' },
    // Add more employees as needed
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-50 h-screen">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">All Employees</h2>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">{employee.position}</td>
                <td className="py-2 px-4 border-b">{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
