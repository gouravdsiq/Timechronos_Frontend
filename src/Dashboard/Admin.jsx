import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Clock, FileText, Users, Briefcase, BarChart2, PieChart, CheckSquare, TrendingUp, Calendar } from 'lucide-react';
import RecentActivityModal from '../Admin Panel/RecentActivityModal';
import ProfileModal from '../Admin Panel/ProfileModal';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Import new analytics components
import ResourceUtilizationMetrics from '../Admin Panel/ResourceUtilizationMetrics';
import BillabilityPerformance from '../Admin Panel/BillabilityPerfromance';
import TimesheetOffenseTracking from '../Admin Panel/TimesheetOffenceTracking';
import InsightsRecommendations from '../Admin Panel/InsightsRecommendation';
import DateRangePicker from '../Admin Panel/DaterangePicker';

// Main Dashboard content component
const DashboardContent = ({ openRecentActivityModal, dateRange, setDateRange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fake data for dashboard stats (keeping original stats)
  const stats = {
    totalEmployees: 28,
    activeEmployees: 22,
    activeProjects: 12,
    avgHoursWorked: 7.5,
    pendingRequests: 7,
    activeClients: 15,
    activeTasks: 24
  };

  // Sample employee activity data (keeping original)
  const recentActivity = [
    { id: 1, name: 'Sarah Johnson', action: 'Started work', project: 'Web Redesign', time: '9:15 AM' },
    { id: 2, name: 'David Miller', action: 'Completed task', project: 'Mobile App', time: '10:30 AM' },
    { id: 3, name: 'Alex Wong', action: 'Submitted report', project: 'Client Portal', time: '11:45 AM' },
    { id: 4, name: 'Emma Davis', action: 'Break', project: '-', time: '12:30 PM' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: PieChart },
    { id: 'compliance', label: 'Compliance', icon: CheckSquare },
    { id: 'insights', label: 'Insights', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Original Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Recent Activity and Upcoming Deadlines - Side by Side */}
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
          </div>
        );
      case 'analytics':
        return <ResourceUtilizationMetrics dateRange={dateRange} />;
      case 'performance':
        return <BillabilityPerformance dateRange={dateRange} />;
      case 'compliance':
        return <TimesheetOffenseTracking dateRange={dateRange} />;
      case 'insights':
        return <InsightsRecommendations dateRange={dateRange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range Picker and Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Admin Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track performance, analyze trends, and get actionable insights</p>
          </div>
          <DateRangePicker 
            onDateRangeChange={setDateRange}
            initialRange="last7days"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      {renderTabContent()}
    </div>
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
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 7 Days'
  });

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
    return 'Admin Analytics Dashboard';
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
            <DashboardContent 
              openRecentActivityModal={openRecentActivityModal}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
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