import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Clock, FileText, Users, Briefcase, BarChart2, PieChart, CheckSquare } from 'lucide-react';
import RecentActivityModal from '../Admin Panel/RecentActivityModal';
import ProfileModal from '../Admin Panel/ProfileModal';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Main Dashboard content component
const DashboardContent = ({ openRecentActivityModal }) => {
  const navigate = useNavigate();
  
  // Fake data for dashboard stats
  const stats = {
    totalEmployees: 28,
    activeEmployees: 22,
    activeProjects: 12,
    avgHoursWorked: 7.5,
    pendingRequests: 7,
    activeClients: 15,
    activeTasks: 24
  };

  // Sample employee activity data
  const recentActivity = [
    { id: 1, name: 'Sarah Johnson', action: 'Started work', project: 'Web Redesign', time: '9:15 AM' },
    { id: 2, name: 'David Miller', action: 'Completed task', project: 'Mobile App', time: '10:30 AM' },
    { id: 3, name: 'Alex Wong', action: 'Submitted report', project: 'Client Portal', time: '11:45 AM' },
    { id: 4, name: 'Emma Davis', action: 'Break', project: '-', time: '12:30 PM' }
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#fff] rounded-lg shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-semibold text-[#44343E] mb-1">Employees</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              <div className="text-sm text-[#000]">Total</div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-[#000]">Active</div>
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
              onClick={() => navigate('/admin-dashboard/employee-list')}
            >
              View All
            </button>
          </div>
        </div>

        <div className="bg-[#fff] rounded-lg shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#44343E] mb-1">Active Projects</div>
              <div className="text-2xl font-bold text-gray-800">{stats.activeProjects}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-4">
            <button 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={() => navigate('/admin-dashboard/active-projects')}
            >
              View All
            </button>
          </div>
        </div>

        <div className="bg-[#fff] rounded-lg shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#44343E] mb-1">Active Clients</div>
              <div className="text-2xl font-bold text-gray-800">{stats.activeClients}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-4">
            <button 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={() => navigate('/admin-dashboard/client')}
            >
              View All
            </button>
          </div>
        </div>

        <div className="bg-[#fff] rounded-lg shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#44343E] mb-1">Active Tasks</div>
              <div className="text-2xl font-bold text-gray-800">{stats.activeTasks}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-4">
            <button 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={() => navigate('/admin-dashboard/task')}
            >
              View All
            </button>
          </div>
        </div>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#fff] rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#44343E]">Total Time Tracked</h3>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800">8h 51m</div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <div className='text-[#000]'>This week: 32h 15m</div>
            <div className='text-[#000]'>This month: 97h 52m</div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-[#fff] rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#44343E]">Productive vs. Idle Time</h3>
          </div>
          <div className="flex items-center space-x-6">
            <div>
              <div className="text-sm text-[#000]">Productive</div>
              <div className="text-2xl font-bold text-gray-800">7h</div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-[#000]">Idle</div>
              <div className="text-2xl font-bold text-gray-800">1h 30m</div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#fff] rounded-lg shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#44343E]">Upcoming Deadlines</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-[#000]">Website Redesign</div>
                <div className="text-xs text-gray-500">Client: XYZ Corp</div>
              </div>
              <div className="text-xs font-semibold text-red-500">Tomorrow</div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-[#000]">Mobile App Phase 1</div>
                <div className="text-xs text-gray-500">Client: ABC Inc</div>
              </div>
              <div className="text-xs font-semibold text-amber-500">In 3 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#fff] rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#44343E]">Recent Employee Activity</h3>
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

        <div className="bg-[#fff] rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#44343E]">Timeline</h3>
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
    </>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRecentActivityModal, setShowRecentActivityModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Determine the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('employee-list')) return 'Employee List';
    if (path.includes('active-projects')) return 'Active Projects';
    if (path.includes('client')) return 'Active Clients';
    if (path.includes('profile')) return 'Profile';
    if (path.includes('task')) return 'Tasks Management';
    if (path.includes('manager')) return 'Manager Dashboard';
    if (path.includes('timesheet')) return 'Timesheet';
    return 'Admin Dashboard';
  };

  // Update activeSection based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('employee-list')) setActiveSection('Employees');
    else if (path.includes('active-projects')) setActiveSection('Projects');
    else if (path.includes('client')) setActiveSection('Clients');
    else if (path.includes('task')) setActiveSection('Tasks');
    else if (path.includes('manager')) setActiveSection('Manager');
    else if (path.includes('timesheet')) setActiveSection('Timesheet');
    else setActiveSection('Dashboard');
  }, [location]);

  // Format date and time functions
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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

  // Functions to open/close the Recent Activity modal
  const openRecentActivityModal = () => {
    setShowRecentActivityModal(true);
  };

  const closeRecentActivityModal = () => {
    setShowRecentActivityModal(false);
  };

  // Sample employee activity data
  const recentActivity = [
    { id: 1, name: 'Sarah Johnson', action: 'Started work', project: 'Web Redesign', time: '9:15 AM' },
    { id: 2, name: 'David Miller', action: 'Completed task', project: 'Mobile App', time: '10:30 AM' },
    { id: 3, name: 'Alex Wong', action: 'Submitted report', project: 'Client Portal', time: '11:45 AM' },
    { id: 4, name: 'Emma Davis', action: 'Break', project: '-', time: '12:30 PM' }
  ];

  return (
    <div className="flex h-screen bg-[#fff]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Sidebar Component */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {/* Navbar Component */}
        <Navbar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          pageTitle={getPageTitle()}
        />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#fef4f3] p-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {/* If we're at the root admin dashboard path, show DashboardContent */}
          {location.pathname === '/admin-dashboard' ? (
            <DashboardContent openRecentActivityModal={openRecentActivityModal} />
          ) : (
            /* Otherwise, render whatever child route is active using the Outlet */
            <Outlet />
          )}
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
            onClose={() => setShowProfileModal(false)}
            userData={{}} // Pass appropriate user data here
            onSave={(updatedData) => {
              console.log('Updated user data:', updatedData);
              setShowProfileModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Export DashboardContent as a static property of AdminDashboard
AdminDashboard.DashboardContent = DashboardContent;

export default AdminDashboard;