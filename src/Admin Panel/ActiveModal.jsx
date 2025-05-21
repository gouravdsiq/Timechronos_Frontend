import React, { useEffect, useState, useMemo } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X, Edit, Archive } from 'lucide-react';
import '@progress/kendo-theme-default/dist/all.css';
import AddProjectModal from '../Admin Panel/AddProject';

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('active');
  const [editingProject, setEditingProject] = useState(null); // State for editing project
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

  const sampleProjects = [
    { 
      id: 1, 
      name: 'Website Redesign', 
      clientName: 'Acme Corp',
      startDate: '2023-01-15', 
      endDate: '2023-03-30'
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      clientName: 'TechStart',
      startDate: '2023-02-01', 
      endDate: '2023-05-15'
    },
    { 
      id: 3, 
      name: 'E-commerce Platform', 
      clientName: 'RetailPlus',
      startDate: '2023-03-01', 
      endDate: '2023-06-30'
    },
    { 
      id: 4, 
      name: 'Legacy System Upgrade', 
      clientName: 'OldTech Inc',
      startDate: '2021-01-01', 
      endDate: '2021-06-30'
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        setProjects(sampleProjects);
      } catch (e) {
        setError('Error fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const today = new Date();
    let filtered = projects.filter(project => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const isActive = startDate <= today && today <= endDate;
      const isUpcoming = startDate > today;
      const isDeadlineExceeded = endDate < today;

      const matchesSearchTerm = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      if (view === 'active' && isActive) return matchesSearchTerm;
      if (view === 'upcoming' && isUpcoming) return matchesSearchTerm;
      if (view === 'deadlineExceeded' && isDeadlineExceeded) return matchesSearchTerm;

      return false;
    });

    // Apply sorting and filtering from the Grid's state
    const result = process(filtered, gridState);
    return result;
  }, [projects, view, searchTerm, gridState]);

  // Custom cell for client name
  const ClientCell = (props) => {
    return (
      <td className="px-4 py-2">
        <span className="font-medium text-gray-800">{props.dataItem.clientName}</span>
      </td>
    );
  };

  // Custom cell for date range filters
  const DateCell = ({ field, dataItem }) => {
    return (
      <td className="px-4 py-2">
        <span className="text-gray-700">{dataItem[field]}</span>
      </td>
    );
  };

  // Custom cell for actions
  const ActionsCell = (props) => {
    return (
      <td className="px-4 py-2">
        <div className="flex space-x-2">
          <button 
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => {
              setEditingProject(props.dataItem); // Set the project to be edited
              setIsModalOpen(true); // Open the modal
            }}
          >
            <Edit size={18} />
          </button>
          <button 
            className="p-1 rounded-md text-yellow-600 hover:bg-yellow-100 transition duration-200"
            onClick={() => console.log('Archive', props.dataItem.id)}
          >
            <Archive size={18} />
          </button>
        </div>
      </td>
    );
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg">
      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Active Projects</h1>

      {/* View Toggle Buttons */}
      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md ${view === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('active')}
        >
          Active Projects
        </button>
        <button
          className={`px-4 py-2 rounded-md ${view === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('upcoming')}
        >
          Upcoming Projects
        </button>
        <button
          className={`px-4 py-2 rounded-md ${view === 'deadlineExceeded' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('deadlineExceeded')}
        >
          Deadline Exceeded
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Add Project Button */}
        <button
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
          onClick={() => {
            setEditingProject(null); // Clear editing project for new project
            setIsModalOpen(true);
          }}
        >
          Add Project
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Grid
          data={filteredProjects}
          pageable
          sortable
          filterable
          style={{ height: '400px' }}
          onDataStateChange={e => setGridState(e.dataState)}
          filter={gridState.filter}
        >
          <Column 
            field="id" 
            title="ID" 
            width="60px" 
            filterable={false} 
          />
          <Column 
            field="name" 
            title="Project Name" 
          />
          <Column 
            field="clientName" 
            title="Client" 
            cell={ClientCell} 
          />
          <Column 
            field="startDate" 
            title="Start Date" 
            cell={(props) => <DateCell field="startDate" dataItem={props.dataItem} />}
          />
          <Column 
            field="endDate" 
            title="End Date" 
            cell={(props) => <DateCell field="endDate" dataItem={props.dataItem} />}
          />
          <Column 
            title="Actions" 
            width="120px"
            filterable={false}
            cell={ActionsCell} 
          />
        </Grid>
      )}

      {isModalOpen && (
        <AddProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAddProject={(projectData) => {
            if (editingProject) {
              // Update existing project
              setProjects(prev => 
                prev.map(project => 
                  project.id === editingProject.id ? { ...project, ...projectData } : project
                )
              );
              alert('Project updated successfully!');
            } else {
              // Add new project
              const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
              const projectToAdd = { id: newId, ...projectData };
              setProjects([...projects, projectToAdd]);
              alert('Project added successfully!');
            }
            setIsModalOpen(false);
            setEditingProject(null);
          }} 
          initialData={editingProject}
        />
      )}
    </div>
  );
};

export default ActiveProjects;
