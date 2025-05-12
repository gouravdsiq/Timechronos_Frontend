import React, { useEffect, useState } from 'react';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddProjectModal from '../Admin Panel/AddProject'; 

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Sample projects to initialize localStorage if empty
  const sampleProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      startDate: '2023-01-15',
      endDate: '2023-03-30',
      assignedEmployees: ['John Doe', 'Jane Smith'],
      domain: 'Web Development',
      clientName: 'Acme Corp'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      startDate: '2023-02-01',
      endDate: '2023-05-15',
      assignedEmployees: ['Michael Brown', 'Emily Clark'],
      domain: 'Mobile Development',
      clientName: 'TechStart'
    },
    {
      id: 3,
      name: 'E-commerce Platform',
      startDate: '2023-03-01',
      endDate: '2023-06-30',
      assignedEmployees: ['Sarah Johnson', 'David Miller'],
      domain: 'E-commerce',
      clientName: 'RetailPlus'
    },
    {
      id: 4,
      name: 'Legacy System Upgrade',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
      assignedEmployees: ['Alice Walker', 'Bob Brown'],
      domain: 'System Integration',
      clientName: 'OldTech Inc'
    },
  ];

  // Load projects from localStorage or initialize with sample data
  const fetchProjects = () => {
    try {
      setLoading(true);
      // Check if localStorage has projects data
      const storedProjects = localStorage.getItem('projects');
      
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        // Initialize with sample data if nothing in localStorage
        localStorage.setItem('projects', JSON.stringify(sampleProjects));
        setProjects(sampleProjects);
      }
    } catch (error) {
      setError('Error loading projects: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on selected view
  const filteredProjects = projects.filter((project) => {
    const today = new Date();
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);

    if (view === 'active') return startDate <= today && today <= endDate;
    if (view === 'upcoming') return startDate > today;
    if (view === 'deadlineExceeded') return endDate < today;
    return true;
  });

  // Add a new project
  const handleAddProject = (newProject) => {
    const newId = projects.length > 0
      ? Math.max(...projects.map((p) => p.id)) + 1
      : 1;
  
    // Append new project with ID
    const projectToAdd = { 
      id: newId, 
      ...newProject,
      assignedEmployees: [] 
    };
  
   
    const updatedProjects = [...projects, projectToAdd];
    setProjects(updatedProjects);
    // localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
    // Close the modal
    setIsModalOpen(false);
  };
  
  return (
    <div className="flex flex-col p-6 bg-gray-50 h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <div className="bg-white rounded-lg shadow-lg p-5 mb-4 flex flex-wrap items-center justify-between">
        {/* View Toggle Buttons */}
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button
            className={`px-4 py-2 rounded-md ${view === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
            onClick={() => setView('active')}
          >
            Active Projects
          </button>
          <button
            className={`px-4 py-2 rounded-md ${view === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
            onClick={() => setView('upcoming')}
          >
            Upcoming Projects
          </button>
          <button
            className={`px-4 py-2 rounded-md ${view === 'deadlineExceeded' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-200`}
            onClick={() => setView('deadlineExceeded')}
          >
            Deadline Exceeded
          </button>
        </div>

        {/* Add New Project Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add New Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-5">
        {loading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-gray-500">No projects found for selected category.</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 border-b text-left">Project Name</th>
                <th className="py-3 px-4 border-b text-left">Client</th>
                <th className="py-3 px-4 border-b text-left">Timeline</th>
                <th className="py-3 px-4 border-b text-left">Domain</th>
                <th className="py-3 px-4 border-b text-left">Assigned Employees</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-blue-100 transition duration-200">
                  <td className="py-3 px-4 border-b">{project.name}</td>
                  <td className="py-3 px-4 border-b">{project.clientName}</td>
                  <td className="py-3 px-4 border-b">
                    {`${project.startDate} - ${project.endDate}`}
                  </td>
                  <td className="py-3 px-4 border-b">{project.domain}</td>
                  <td className="py-3 px-4 border-b">
                    {project.assignedEmployees && project.assignedEmployees.length > 0 
                      ? project.assignedEmployees.join(', ') 
                      : 'None assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddProject={handleAddProject}
        />
      )}
    </div>
  );
};

export default ActiveProjects;