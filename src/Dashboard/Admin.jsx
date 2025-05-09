import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, Users, Briefcase, BarChart2, PieChart, Settings, ChevronDown, Bell, User, LogOut, Menu, ChevronLeft } from 'lucide-react';
import RecentActivityModal from '../Admin Panel/RecentActivityModal';
import ProfileModal from '../Admin Panel/ProfileModal'; // Import ProfileModal

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // State for ProfileModal


  // Sample company ID - in a real app, this would come from auth context/state
  const companyId = '123';

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Modal state for RecentActivityModal
  const [showRecentActivityModal, setShowRecentActivityModal] = useState(false);

  // Fake data for dashboard stats
  const stats = {
    totalEmployees: 28,
    activeEmployees: 22,
    activeProjects: 12,
    avgHoursWorked: 7.5,
    pendingRequests: 7
  };

  // Sample employee activity data
  const recentActivity = [
    { id: 1, name: 'Sarah Johnson', action: 'Started work', project: 'Web Redesign', time: '9:15 AM' },
    { id: 2, name: 'David Miller', action: 'Completed task', project: 'Mobile App', time: '10:30 AM' },
    { id: 3, name: 'Alex Wong', action: 'Submitted report', project: 'Client Portal', time: '11:45 AM' },
    { id: 4, name: 'Emma Davis', action: 'Break', project: '-', time: '12:30 PM' }
  ];

  // Format date
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time (HH:MM:SS)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/login';
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }

      // no datePickerRef defined or used, so removed related condition to avoid errors
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Functions to open/close the Recent Activity modal
  const openRecentActivityModal = () => {
    setShowRecentActivityModal(true);
  };

  const closeRecentActivityModal = () => {
    setShowRecentActivityModal(false);
  };

  // Navigate to employee list on "View All" click in Employees card
  const handleViewAllEmployees = () => {
    navigate('/admin-dashboard/employee-list');
  };

  const navigateToProfile = () => {
    navigate(`/admin-dashboard/update-profile/${companyId}`);
    setShowUserMenu(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`bg-indigo-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`p-5 flex items-center space-x-2 border-b border-indigo-700 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Clock className="w-6 h-6" />
          {!sidebarCollapsed && <h1 className="text-xl font-bold">TimeChronos</h1>}
        </div>

        {!sidebarCollapsed && (
          <div className="p-3">
            <div className="text-xs text-indigo-200 uppercase font-semibold mb-2">Admin Panel</div>
          </div>
        )}

        <nav className="flex-1">
          <div 
            className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
              activeSection === 'Dashboard' ? 'bg-indigo-900 text-white border-l-4 border-white' : 'text-indigo-100 hover:bg-indigo-700'
            }`}
            onClick={() => setActiveSection('Dashboard')}
          >
            <PieChart className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </div>   

          <div 
            className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
              activeSection === 'Employees' ? 'bg-indigo-900 text-white border-l-4 border-white' : 'text-indigo-100 hover:bg-indigo-700'
            }`}
            onClick={() => setActiveSection('Employees')}
          >
            <Users className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Employees</span>}
          </div>

          <div className={`px-3 py-2 text-indigo-100 hover:bg-indigo-700 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center`}>
            <Briefcase className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Clients</span>}

          </div>

          <div className={`px-3 py-2 text-indigo-100 hover:bg-indigo-700 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center`}>
            <BarChart2 className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Projects</span>}
          </div>

          <div className={`px-3 py-2 text-indigo-100 hover:bg-indigo-700 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center`}>
            <BarChart2 className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Task</span>}
          </div>

          <div className={`px-3 py-2 text-indigo-100 hover:bg-indigo-700 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center`}>
            <BarChart2 className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>TimeSheet</span>}
          </div>

          <div className={`px-3 py-2 text-indigo-100 hover:bg-indigo-700 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center`}>
            <BarChart2 className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Manager</span>}
          </div>

          <div className={`px-3 py-2 text-indigo-100 hover:bg-indigo-700 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center`}>
            <FileText className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>Reports</span>}
          </div>

        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-indigo-700 flex items-center mt-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <span className="font-semibold">A</span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-indigo-300">admin@timechronos.com</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="mr-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}  
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
              <div className="flex items-center ml-4">
                <div className="text-sm text-gray-500">{formatDate(currentDate)}</div>
                <div className="text-sm text-gray-500 ml-2">• {formatTime(currentTime)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100 relative" aria-label="Notifications">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <div className="border-l border-gray-300 h-6"></div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" aria-label="Settings">
                <Settings className="w-4 h-4 mr-2" />
              </a>
              <div className="border-l border-gray-300 h-6"></div>

              {/* User profile with dropdown */}
              <div className="relative user-menu-container">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={toggleUserMenu}
                  tabIndex={0}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="ml-2 text-sm font-medium">Admin</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
                </div>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
                    role="menu"
                    aria-orientation="vertical"
                    aria-label="User menu"
                  >
                     <button 
                      onClick={navigateToProfile}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                      role="menuitem"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Employees</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Active</div>
                  <div className="text-2xl font-bold text-gray-800">{stats.activeEmployees}</div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(stats.activeEmployees / stats.totalEmployees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex justify-end pt-4">
                <button 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  onClick={handleViewAllEmployees}
                >
                  View All
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Active Projects</div>
                  <div className="text-2xl font-bold text-gray-800">{stats.activeProjects}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <div className="mt-auto flex justify-end pt-4">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  View All
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Avg. Hours Worked</div>
                  <div className="text-2xl font-bold text-gray-800">{stats.avgHoursWorked}h</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Pending Requests</div>
                  <div className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
              </div>

              <div className="mt-auto flex justify-end pt-4">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  View All
                </button>
              </div>
            </div>
          </div>

          {/* Time Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium">Total Time Tracked</h3>
              </div>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-800">8h 51m</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                <div>This week: 32h 15m</div>
                <div>This month: 97h 52m</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium">Productive vs. Idle Time</h3>
              </div>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-sm text-gray-500">Productive</div>
                  <div className="text-2xl font-bold text-gray-800">7h</div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Idle</div>
                  <div className="text-2xl font-bold text-gray-800">1h 30m</div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col">
              {/* Intentionally left empty for future widget */}
            </div>
          </div>

          {/* Recent Activity and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium">Recent Employee Activity</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-500" onClick={openRecentActivityModal}>View All</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium">
                        {activity.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">{activity.name}</div>
                        <div className="text-xs text-gray-500">{activity.action} • {activity.project}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium">Timeline</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-500">Timeline Report</button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 h-56 overflow-hidden">
                <div className="relative h-full">
                  <div className="absolute top-0 left-0 w-full h-8 bg-gray-200 rounded-md"></div>

                  {/* Working time visualization */}
                  <div className="absolute top-0 left-0 h-8 bg-red-400 rounded-md" style={{ width: '60%' }}></div>

                  <div className="absolute bottom-0 left-0 w-full mt-2 flex justify-between text-xs text-gray-500">
                    <div>08:00</div>
                    <div>10:00</div>
                    <div>12:00</div>
                    <div>14:00</div>
                    <div>16:00</div>
                    <div>18:00</div>
                  </div>

                  <div className="absolute right-0 bottom-12 text-xs text-gray-600 flex items-center">
                    <div className="mr-2">Start: 9:55 AM</div>
                    <div>End: 12:03 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Recent Activity Modal */}
        {showRecentActivityModal && (
          <RecentActivityModal 
            activityList={recentActivity} 
            onClose={closeRecentActivityModal} 
          />
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={closeProfileModal}
            userData={userData}
            onSave={(updatedData) => {
              console.log('Updated user data:', updatedData);
              // Handle saving updatedData here if needed
              closeProfileModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

