import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, 
  Users, 
  Briefcase, 
  BarChart2, 
  FileText, 
  ChevronLeft, 
  Menu 
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const first_name = useSelector((state) => state.auth.first_name);
  const email = useSelector((state) => state.auth.email);
  
  // Get first letter of name for the avatar
  const firstLetter = first_name ? first_name.charAt(0).toUpperCase() : '';

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Navigation handlers
  const handleViewAllEmployees = () => {
    navigate('/admin-dashboard/employee-list');
  };

  const handleViewAllActiveProjects = () => {
    navigate('/admin-dashboard/active-projects');
  };

  const handleViewAllClients = () => {
    navigate('/admin-dashboard/client');
  };

  const handleManager = () => {
    navigate('/admin-dashboard/manager');
  };

  const handleTimesheet = () => {
    navigate('/admin-dashboard/timesheet');
  };

  return (
    <div 
      className={`text-[#5A367D] flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-45'
      }`}
    >
      <div className={`p-5 flex items-center space-x-2 border-opacity-20 border-[#130b3d] ${sidebarCollapsed ? 'justify-center' : ''}`}>
        {sidebarCollapsed ? (
          <img 
            src="/assets/SidebarLogo.png" 
            alt="Logo" 
            className="w-6 h-6 object-contain" 
          />
        ) : (
          <div className="flex items-center">
            <img 
              src="/assets/SidebarLogo.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain" 
            />
            <h1 className="text-xl font-bold ml-2">TimeChronos</h1>
          </div>
        )}
      </div>

      <nav className="flex-1">
        <div 
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Dashboard' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
          onClick={() => setActiveSection('Dashboard')}
        >
          <PieChart className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Dashboard</span>}
        </div>   
        <div
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Employees' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
          onClick={handleViewAllEmployees}
        >
          <Users className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Employees</span>}
        </div>
        <div 
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Clients' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
          onClick={handleViewAllClients}
        >
          <Briefcase className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Clients</span>}
        </div>

        <div
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Projects' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
          onClick={handleViewAllActiveProjects}
        >
          <BarChart2 className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Projects</span>}
        </div>

        <div 
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Tasks' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <BarChart2 className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Task</span>}
        </div>

        <div 
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'TimeSheet' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
          onClick={handleTimesheet}
        >
          <BarChart2 className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>TimeSheet</span>}
        </div>

        <div 
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Manager' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`} 
          onClick={handleManager}
        >
          <BarChart2 className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Manager</span>}
        </div>

        <div 
          className={`px-3 py-2 cursor-pointer flex ${sidebarCollapsed ? 'justify-center' : ''} items-center ${
            activeSection === 'Reports' ? 'bg-white bg-opacity-30 text-[#5A367D] border-l-4 border-[#5A367D]' : 'text-[#000] hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <FileText className="w-5 h-5 mr-3" />
          {!sidebarCollapsed && <span>Reports</span>}
        </div>
      </nav>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-opacity-20 border-[#130b3d] flex items-center mt-auto">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-30 text-[#5A367D] flex items-center justify-center">
            <span className="font-semibold">{firstLetter}</span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">{first_name}</div>
            <div className="text-xs text-[#5A367D] opacity-75">{email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;