import React, { useEffect, useState } from 'react';
import { Briefcase, ArrowLeft } from 'lucide-react'; // Import the Briefcase and ArrowLeft icons
import { useNavigate } from 'react-router-dom';

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]); // State to hold the active projects
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages
  const navigate = useNavigate(); // Hook to navigate

  // Sample data for active projects
  const sampleProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      startDate: '2023-01-15',
      endDate: '2023-03-30',
      assignedEmployees: ['John Doe', 'Jane Smith'],
    },
    {
      id: 2,
      name: 'Mobile App Development',
      startDate: '2023-02-01',
      endDate: '2023-05-15',
      assignedEmployees: ['Michael Brown', 'Emily Clark'],
    },
    {
      id: 3,
      name: 'E-commerce Platform',
      startDate: '2023-03-01',
      endDate: '2023-06-30',
      assignedEmployees: ['Sarah Johnson', 'David Miller'],
    },
  ];

  // Function to simulate fetching active projects
  const fetchActiveProjects = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      // Simulate a delay to mimic an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProjects(sampleProjects); // Set the sample projects data
    } catch (error) {
      setError(error.message); // Set error message if fetching fails
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchActiveProjects(); // Call the fetch function when the component mounts
  }, []);

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

      <h1 className="text-2xl font-bold mb-4">Active Projects</h1>
      <div className="bg-white rounded-lg shadow-lg p-5">
        {loading ? (
          <div className="text-gray-500">Loading active projects...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-500">No active projects found.</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 border-b text-left">Project Name</th>
                <th className="py-3 px-4 border-b text-left">Timeline</th>
                <th className="py-3 px-4 border-b text-left">Assigned Employees</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-blue-100 transition duration-200">
                  <td className="py-3 px-4 border-b">{project.name}</td>
                  <td className="py-3 px-4 border-b">{`${project.startDate} - ${project.endDate}`}</td>
                  <td className="py-3 px-4 border-b">
                    {project.assignedEmployees.join(', ')} {/* Assuming assignedEmployees is an array */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActiveProjects;
