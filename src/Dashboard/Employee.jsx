import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Play, Pause, Edit, Save, Calendar, User, ChevronDown, Bell, Search, LogOut, PlusCircle, XCircle, AlertTriangle } from 'lucide-react';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTimeValue, setEditedTimeValue] = useState("");

  // Sample tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Website Homepage Redesign",
      project: "Company Website Overhaul",
      status: "ongoing",
      priority: "high",
      deadline: "2025-05-12",
      timeSpent: 5400, // in seconds (1h 30m)
      description: "Redesign the homepage to improve user engagement and conversion rates."
    },
    {
      id: 2,
      title: "User Authentication System",
      project: "Client Portal",
      status: "ongoing",
      priority: "medium",
      deadline: "2025-05-14",
      timeSpent: 10800, // in seconds (3h)
      description: "Implement secure login and authentication for the client portal."
    },
    {
      id: 3,
      title: "Mobile Responsive Layout",
      project: "E-commerce App",
      status: "completed",
      priority: "high",
      deadline: "2025-05-05",
      timeSpent: 18000, // in seconds (5h)
      description: "Ensure all pages are fully responsive on mobile devices."
    },
    {
      id: 4,
      title: "Payment Integration",
      project: "E-commerce App",
      status: "failed",
      priority: "critical",
      deadline: "2025-05-04",
      timeSpent: 7200, // in seconds (2h)
      description: "API integration with payment gateways failed due to incompatible versions."
    },
    {
      id: 5,
      title: "Data Migration Script",
      project: "Database Upgrade",
      status: "completed",
      priority: "medium",
      deadline: "2025-05-01",
      timeSpent: 14400, // in seconds (4h)
      description: "Create and run script to migrate data to the new database structure."
    },
    {
      id: 6,
      title: "Security Vulnerability Fix",
      project: "Client Portal",
      status: "ongoing",
      priority: "critical",
      deadline: "2025-05-08",
      timeSpent: 3600, // in seconds (1h)
      description: "Address the identified XSS vulnerabilities in the form submission."
    }
  ]);

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Parse time string (HH:MM:SS) to seconds
  const parseTimeToSeconds = (timeString) => {
    if (!timeString) return 0;
    
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + (seconds || 0);
  };

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Timer functionality
  useEffect(() => {
    let interval;
    
    if (timerRunning && activeTimer !== null) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
        
        // Update the task's timeSpent value in real time
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === activeTimer ? { ...task, timeSpent: task.timeSpent + 1 } : task
          )
        );
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerRunning, activeTimer]);

  const startTimer = (taskId) => {
    if (activeTimer !== null && activeTimer !== taskId) {
      // Stop the current timer before starting a new one
      setTimerRunning(false);
      setActiveTimer(null);
      setElapsedTime(0);
    }
    
    setActiveTimer(taskId);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
    setElapsedTime(0);
  };

  const startEditingTime = (taskId, currentTime) => {
    setEditingTaskId(taskId);
    setEditedTimeValue(formatTime(currentTime));
  };

  const saveEditedTime = (taskId) => {
    const newTimeInSeconds = parseTimeToSeconds(editedTimeValue);
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, timeSpent: newTimeInSeconds } : task
      )
    );
    
    setEditingTaskId(null);
    setEditedTimeValue("");
  };

  const filterTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const ongoingTasks = filterTasksByStatus('ongoing');
  const completedTasks = filterTasksByStatus('completed');
  const failedTasks = filterTasksByStatus('failed');

  // Get priority style based on task priority
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-5 flex items-center space-x-2 border-b border-blue-800">
          <Clock className="w-6 h-6" />
          <h1 className="text-xl font-bold">TimeChronos</h1>
        </div>
        
        <div className="p-4">
          <div className="text-xs text-blue-300 uppercase font-semibold mb-2">Employee Portal</div>
        </div>
        
        <nav className="flex-1">
          <div className="px-3 py-2 bg-blue-800 text-white border-l-4 border-white flex items-center">
            <Clock className="w-5 h-5 mr-3" />
            <span>My Tasks</span>
          </div>
          
          <div className="px-3 py-2 text-blue-200 hover:bg-blue-800 cursor-pointer flex items-center">
            <Calendar className="w-5 h-5 mr-3" />
            <span>Calendar</span>
          </div>
          
          <div className="px-3 py-2 text-blue-200 hover:bg-blue-800 cursor-pointer flex items-center">
            <CheckCircle className="w-5 h-5 mr-3" />
            <span>Completed Tasks</span>
          </div>
          
          <div className="px-3 py-2 text-blue-200 hover:bg-blue-800 cursor-pointer flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>Issues</span>
          </div>
        </nav>
        
        <div className="p-4 border-t border-blue-800 flex items-center mt-auto">
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center">
            <span className="font-semibold">E</span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">Employee</div>
            <div className="text-xs text-blue-300">employee@mediaamp.co.in</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">My Dashboard</h2>
              <div className="text-sm text-gray-500 ml-4">
                <div className="font-medium">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="ml-2 bg-transparent border-none focus:outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              <div className="border-l border-gray-300 h-6"></div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Employee</span>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Task Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Ongoing Tasks</h3>
                    <p className="text-sm text-gray-500">Currently in progress</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">{ongoingTasks.length}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(ongoingTasks.length / tasks.length) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Completed Tasks</h3>
                    <p className="text-sm text-gray-500">Successfully finished</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{completedTasks.length}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Failed Tasks</h3>
                    <p className="text-sm text-gray-500">Issues encountered</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">{failedTasks.length}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: `${(failedTasks.length / tasks.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Ongoing Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Ongoing Tasks</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-500">
                <PlusCircle className="w-4 h-4 mr-1" />
                Add New Task
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ongoingTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.deadline}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTaskId === task.id ? (
                          <div className="flex items-center">
                            <input 
                              type="text" 
                              value={editedTimeValue}
                              onChange={(e) => setEditedTimeValue(e.target.value)}
                              className="w-24 px-2 py-1 text-sm border rounded"
                              placeholder="HH:MM:SS"
                            />
                            <button 
                              onClick={() => saveEditedTime(task.id)}
                              className="ml-2 text-green-600 hover:text-green-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="text-sm font-medium">{formatTime(task.timeSpent)}</div>
                            <button 
                              onClick={() => startEditingTime(task.id, task.timeSpent)}
                              className="ml-2 text-gray-400 hover:text-gray-500"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {activeTimer === task.id && timerRunning ? (
                          <button 
                            onClick={stopTimer}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Stop
                          </button>
                        ) : (
                          <button 
                            onClick={() => startTimer(task.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Completed and Failed Tasks in Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completed Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Completed Tasks</h3>
                <span className="text-sm text-gray-500">{completedTasks.length} tasks</span>
              </div>
              
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <div className="font-medium text-gray-800">{task.title}</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{task.project}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Time: {formatTime(task.timeSpent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Failed Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Failed Tasks</h3>
                <span className="text-sm text-gray-500">{failedTasks.length} tasks</span>
              </div>
              
              <div className="space-y-3">
                {failedTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-red-50 rounded-md border border-red-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <div className="font-medium text-gray-800">{task.title}</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{task.project}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Time: {formatTime(task.timeSpent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;