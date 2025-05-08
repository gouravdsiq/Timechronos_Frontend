import React, { useState, useEffect, useRef } from 'react';
import { Clock, FileText, Users, Activity, Calendar, Settings, ChevronDown, Bell, PieChart, User, LogOut, BarChart2, Briefcase, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import RecentActivityModal from '../Admin Panel/RecentActivityModal';

const AdminDashboard = () => {
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 days');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timezone, setTimezone] = useState('UTC');
  const [selectedDates, setSelectedDates] = useState([]);

  const datePickerRef = useRef(null);

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

  // Sample employees data
  const employees = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', position: 'Web Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', position: 'UX Designer', status: 'Inactive' },
    { id: 3, name: 'Michael Brown', email: 'michaelbrown@example.com', position: 'Project Manager', status: 'Active' },
    { id: 4, name: 'Emily Clark', email: 'emilyclark@example.com', position: 'Software Engineer', status: 'Active' }
  ];

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

  // Format date for date picker
  const formatShortDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time (HH:MM:SS)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

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

  // Toggle date picker
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Handle date range selection
  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    // Logic to set start and end dates based on range
    const today = new Date();
    let start = new Date();

    switch(range) {
      case 'Last 7 days':
        start.setDate(today.getDate() - 7);
        break;
      case 'Last 30 days':
        start.setDate(today.getDate() - 30);
        break;
      case 'This month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'Last month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setEndDate(endOfLastMonth);
        break;
      default:
        start.setDate(today.getDate() - 7);
    }

    if (range !== 'Last month') {
      setEndDate(today);
    }
    setStartDate(start);
  };

  // Generate calendar days
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Add empty slots for days before first of month
    for (let i = 0; i < firstDay; i++) {
      if (i === 0) { // If first day is Sunday
        break;
      }
      days.push({ day: null, date: null });
    }

    // Add days of the month
    while (date.getMonth() === month) {
      const dayObj = {
        day: date.getDate(),
        date: new Date(date),
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: selectedDates.some(d => d.toDateString() === date.toDateString())
      };
      days.push(dayObj);
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (!date) return;

    // Toggle date selection
    const dateExists = selectedDates.find(d => d.toDateString() === date.toDateString());

    if (dateExists) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleMonthChange = (direction) => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (direction === 'next') {
      newMonth++;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
    } else {
      newMonth--;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  };

  // Apply date filters
  const handleApplyDates = () => {
    if (selectedDates.length > 0) {
      // Sort dates
      const sortedDates = [...selectedDates].sort((a, b) => a - b);
      setStartDate(sortedDates[0]);
      setEndDate(sortedDates[sortedDates.length - 1]);
    }
    setShowDatePicker(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }

      if (showDatePicker && datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showDatePicker]);

  // Calculate calendar days
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Functions to open/close the Recent Activity modal
  const openRecentActivityModal = () => {
    setShowRecentActivityModal(true);
  };

  const closeRecentActivityModal = () => {
    setShowRecentActivityModal(false);
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
                <button className="p-1 rounded-full hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <div className="border-l border-gray-300 h-6"></div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="w-4 h-4 mr-2" /></a>
                      <div className="border-l border-gray-300 h-6"></div>
              {/* User profile with dropdown */}
              <div className="relative user-menu-container">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={toggleUserMenu}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="ml-2 text-sm font-medium">Admin</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
                </div>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>

                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 px-6 py-2">
            <div className="relative">
              <div className="flex items-center justify-between">

                <button 
                  onClick={toggleDatePicker}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm flex items-center space-x-2 hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatShortDate(startDate)} - {formatShortDate(endDate)}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div 
                  ref={datePickerRef}
                  className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-30 w-full max-w-3xl"
                >
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Calendar */}
                    <div className="w-full md:w-1/2">
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => handleMonthChange('prev')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h3 className="text-lg font-medium">{getMonthName(selectedMonth)} {selectedYear}</h3>
                        <button 
                          onClick={() => handleMonthChange('next')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {/* Days of week */}
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <div key={index} className="text-center text-sm text-gray-500 py-2">
                            {day}
                          </div>
                        ))}

                        {/* Calendar days */}
                        {daysInMonth.map((dayObj, index) => (
                          <div 
                            key={index} 
                            className={`
                              text-center py-2 text-sm rounded-md cursor-pointer
                              ${!dayObj.day ? 'invisible' : ''}
                              ${dayObj.isToday ? 'bg-indigo-100 text-indigo-700' : ''}
                              ${dayObj.isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                            `}
                            onClick={() => handleDateClick(dayObj.date)}
                          >
                            {dayObj.day}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="w-full md:w-1/2">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Current period</h4>
                        <div className="relative">
                          <select 
                            className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={selectedDateRange}
                            onChange={(e) => handleDateRangeChange(e.target.value)}
                          >
                            <option value="Last 7 days">Last 7 days</option>
                            <option value="Last 30 days">Last 30 days</option>
                            <option value="This month">This month</option>
                            <option value="Last month">Last month</option>
                            <option value="Custom date">Custom date</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formatShortDate(startDate)}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formatShortDate(endDate)}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Timezone</h4>
                        <div className="relative">
                          <select
                            className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                          >
                            <option value="UTC">UTC</option>
                            <option value="GMT">GMT</option>
                            <option value="EST">EST</option>
                            <option value="PST">PST</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-6">
                        If you wish to save this view as a report, select a relative range date instead of a custom one.
                      </p>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleApplyDates}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
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
              <div className="flex items-center justify-between mb-4">
                {/* <h3 className="text-gray-700 font-medium">Current Time</h3> */}
              </div>
              {/* <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{formatTime(currentTime)}</div>
                  <div className="text-sm text-gray-500 mt-1">{timezone}</div>
                </div>
              </div> */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
