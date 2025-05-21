import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft, Edit, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import '@progress/kendo-theme-default/dist/all.css';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, modalTitle, projects }) => {
  const [formData, setFormData] = useState({
    project_id: '',
    name: '',
    code: '',
    billable: false,
    start_date: '',
    end_date: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        project_id: '',
        name: '',
        code: '',
        billable: false,
        start_date: '',
        end_date: '',
        description: '',
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { project_id, name, code, billable, start_date, end_date, description } = formData;
    if (!project_id || !name || !code || !start_date || !end_date || !description) {
      alert('Please fill all fields.');
      return;
    }
    onSubmit({
      project_id,
      name,
      code,
      billable,
      start_date,
      end_date,
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
            <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">Project</label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task name"
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
              placeholder="Task code"
            />
          </div>
          <div>
            <label htmlFor="billable" className="flex items-center">
              <input
                id="billable"
                name="billable"
                type="checkbox"
                checked={formData.billable}
                onChange={handleInputChange}
                className="mr-2"
              />
              Billable
            </label>
          </div>
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="Task description"
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
              {modalTitle.includes('Add') ? 'Add New Task' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ActiveTask = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); // State for projects
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
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

  // Sample project data
  const sampleProjects = [
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
    { id: 3, name: 'Project C' },
  ];

  // Sample task data
  const sampleTasks = [
    {
      project_id: 1,
      name: 'Task 1',
      code: 'T001',
      billable: true,
      start_date: '2023-01-01',
      end_date: '2023-01-10',
      description: 'Description for Task 1',
    },
    {
      project_id: 2,
      name: 'Task 2',
      code: 'T002',
      billable: false,
      start_date: '2023-02-01',
      end_date: '2023-02-10',
      description: 'Description for Task 2',
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        setTimeout(() => {
          setProjects(sampleProjects);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch projects from backend');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        setTimeout(() => {
          setTasks(sampleTasks);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch tasks from backend');
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const processedData = process(tasks, gridState);

  const handleAddTask = async (newTask) => {
    try {
      // Create a new task with a generated ID
      const createdTask = {
        ...newTask,
      };
      
      setTasks(prev => [...prev, createdTask]);
      alert('Task added successfully!');
      setIsAddModalOpen(false);
    } catch (error) {
      alert('Add task failed: ' + error.message);
    }
  };

  const handleEditTask = async (updatedTask) => {
    if (!taskToEdit) return;
    
    try {
      // Update the task in the local state
      setTasks(prev =>
        prev.map(t => (t.code === taskToEdit.code ? { ...t, ...updatedTask } : t))
      );
      alert('Task updated successfully!');
      setIsEditModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  const handleArchiveTask = async (taskCode) => {
    if (!window.confirm('Are you sure you want to archive this task?')) return;

    try {
      // Remove the task from the local state
      setTasks(prev => prev.filter(task => task.code !== taskCode));
      alert('Task archived successfully!');
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
              setTaskToEdit(props.dataItem);
              setIsEditModalOpen(true);
            }}
            title="Edit Task"
            className="p-1 rounded-md text-blue-600 hover:bg-blue-100 transition duration-200"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleArchiveTask(props.dataItem.code)}
            title="Archive Task"
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
        <div className="text-lg font-semibold">Loading tasks...</div>
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

      <h1 className="text-2xl font-bold mb-4">Task List</h1>

      <div className="bg-white rounded-lg shadow-lg p-5 flex-grow">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">All Tasks</h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add New Task
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
          <Column field="project_id" title="Project ID" />
          <Column field="name" title="Task Name" />
          <Column field="code" title="Code" />
          <Column field="billable" title="Billable" cell={(props) => <td>{props.dataItem.billable ? 'Yes' : 'No'}</td>} />
          <Column field="start_date" title="Start Date" />
          <Column field="end_date" title="End Date" />
          <Column field="description" title="Description" />
          <Column 
            title="Actions" 
            width="120px"
            filterable={false}
            cell={ActionsCell} 
          />
        </Grid>
      </div>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
        modalTitle="Add New Task"
        projects={projects}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleEditTask}
        initialData={taskToEdit}
        modalTitle="Edit Task"
        projects={projects}
      />
    </div>
  );
};

export default ActiveTask;
