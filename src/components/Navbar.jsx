import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  ChevronDown 
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  pageTitle = "Admin Dashboard" 
}) => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get user data from Redux store
  const first_name = useSelector((state) => state.auth.first_name);
  const capitalizedFirstName = first_name.charAt(0).toUpperCase() + first_name.slice(1);

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Format date (Weekday, Month Day, Year)
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time (HH:MM:SS AM/PM)
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = 'company/login';
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Navigate to profile page
  const navigateToProfile = () => {
    navigate(`/admin-dashboard/profile`);
    setShowUserMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-[#fef4f3] hover:bg-white transition-colors duration-300 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
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
          
          <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" aria-label="Settings">
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
              <div className="ml-2 text-sm font-medium">{capitalizedFirstName}</div>
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                  role="menuitem"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>

                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
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
  );
};

export default Navbar;