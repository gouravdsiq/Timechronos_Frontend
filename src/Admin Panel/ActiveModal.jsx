import React, { useEffect, useState, useMemo } from 'react';
import { Briefcase, ArrowLeft, Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddProjectModal from '../Admin Panel/AddProject';

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState('none');
  const [filters, setFilters] = useState({
    domain: '',
    clientName: ''
  });
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
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

  // Extract unique domains and clients for filter dropdowns
  const domains = useMemo(() => {
    const uniqueDomains = [...new Set(projects.map(project => project.domain))];
    return uniqueDomains;
  }, [projects]);

  const clients = useMemo(() => {
    const uniqueClients = [...new Set(projects.map(project => project.clientName))];
    return uniqueClients;
  }, [projects]);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply search, filters, view filters, and sorting
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    const today = new Date();
    
    // First apply view filter (active, upcoming, deadline exceeded)
    result = result.filter((project) => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);

      if (view === 'active') return startDate <= today && today <= endDate;
      if (view === 'upcoming') return startDate > today;
      if (view === 'deadlineExceeded') return endDate < today;
      return true;
    });

    // Then apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(lowerSearchTerm) ||
        project.clientName.toLowerCase().includes(lowerSearchTerm) ||
        project.domain.toLowerCase().includes(lowerSearchTerm) ||
        (project.assignedEmployees && project.assignedEmployees.some(emp => 
          emp.toLowerCase().includes(lowerSearchTerm)
        ))
      );
    }

    // Apply domain filter
    if (filters.domain) {
      result = result.filter(project => project.domain === filters.domain);
    }

    // Apply client filter
    if (filters.clientName) {
      result = result.filter(project => project.clientName === filters.clientName);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [projects, view, searchTerm, filters, sortConfig]);

  // Group projects based on selected grouping
  const groupedProjects = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Projects': filteredAndSortedProjects };
    }

    return filteredAndSortedProjects.reduce((groups, project) => {
      const groupValue = project[groupBy] || 'Undefined';
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(project);
      return groups;
    }, {});
  }, [filteredAndSortedProjects, groupBy]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      domain: '',
      clientName: ''
    });
    setSortConfig({ key: null, direction: 'ascending' });
  };

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
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
    // Close the modal
    setIsModalOpen(false);
  };

  // Generate a table for each group
  const renderProjectTable = (groupProjects, groupName) => (
    <div key={groupName} className="mb-6">
      {groupBy !== 'none' && (
        <h3 className="text-lg font-semibold mb-2 text-gray-700">{groupName}</h3>
      )}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th 
              className="py-3 px-4 border-b text-left cursor-pointer hover:bg-blue-700" 
              onClick={() => requestSort('name')}
            >
              <div className="flex items-center">
                Project Name
                {sortConfig.key === 'name' && (
                  sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="w-4 h-4 ml-1" /> : 
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </div>
            </th>
            <th 
              className="py-3 px-4 border-b text-left cursor-pointer hover:bg-blue-700"
              onClick={() => requestSort('clientName')}
            >
              <div className="flex items-center">
                Client
                {sortConfig.key === 'clientName' && (
                  sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="w-4 h-4 ml-1" /> : 
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </div>
            </th>
            <th className="py-3 px-4 border-b text-left">Timeline</th>
            <th 
              className="py-3 px-4 border-b text-left cursor-pointer hover:bg-blue-700"
              onClick={() => requestSort('domain')}
            >
              <div className="flex items-center">
                Domain
                {sortConfig.key === 'domain' && (
                  sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="w-4 h-4 ml-1" /> : 
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </div>
            </th>
            <th className="py-3 px-4 border-b text-left">Assigned Employees</th>
          </tr>
        </thead>
        <tbody>
          {groupProjects.map((project) => (
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
    </div>
  );
  
  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <div className="bg-white rounded-lg shadow-lg p-5 mb-4">
        {/* View Toggle Buttons */}
        <div className="flex flex-wrap items-center justify-between mb-4">
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

        {/* Search and Filter Section */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search projects by name, client, domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                <span>Filter</span>
                {(filters.domain || filters.clientName) && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {[filters.domain, filters.clientName].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-3">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      value={filters.domain}
                      onChange={(e) => setFilters({...filters, domain: e.target.value})}
                    >
                      <option value="">All Domains</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      value={filters.clientName}
                      onChange={(e) => setFilters({...filters, clientName: e.target.value})}
                    >
                      <option value="">All Clients</option>
                      {clients.map(client => (
                        <option key={client} value={client}>{client}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-800"
                      onClick={resetFilters}
                    >
                      Reset All
                    </button>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setIsFilterMenuOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Group By Dropdown */}
            <div>
              <select
                className="border border-gray-300 rounded-md bg-white px-4 py-2 text-gray-700"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="none">No Grouping</option>
                <option value="domain">Group by Domain</option>
                <option value="clientName">Group by Client</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.domain || filters.clientName) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.domain && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Domain: {filters.domain}
                  <button 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => setFilters({...filters, domain: ''})}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {filters.clientName && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Client: {filters.clientName}
                  <button 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => setFilters({...filters, clientName: ''})}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {(filters.domain || filters.clientName) && (
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                  onClick={resetFilters}
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-5">
        {loading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : Object.keys(groupedProjects).length === 0 ? (
          <div className="text-gray-500">No projects found for selected criteria.</div>
        ) : (
          <>
            {Object.entries(groupedProjects).map(([groupName, groupProjects]) => 
              renderProjectTable(groupProjects, groupName)
            )}
          </>
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