import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Play, Pause, Edit, Save, Calendar, User, ChevronDown, Bell, Search, LogOut, PlusCircle, XCircle, AlertTriangle } from 'lucide-react';

const EmployeeDashboardUpdatesAndFacts = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState('employee'); // 'employee' or 'approver'
  
  // Mock data for demonstration
  const [timesheetData] = useState({
    currentWeek: 22,
    currentYear: 2025,
    weeklyDeadline: 'Friday 6:00 PM',
    approvalSLA: 2, // business days
    
    // Employee timesheet status
    timesheets: [
      {
        week: 22,
        year: 2025,
        submittedDate: '2025-05-23T17:30:00',
        deadline: '2025-05-23T18:00:00',
        status: 'submitted', // 'pending', 'submitted', 'approved', 'rejected'
        approvedDate: null,
        rejectedDate: null,
        isLate: false
      },
      {
        week: 21,
        year: 2025,
        submittedDate: '2025-05-16T19:15:00',
        deadline: '2025-05-16T18:00:00',
        status: 'approved',
        approvedDate: '2025-05-18T10:30:00',
        rejectedDate: null,
        isLate: true
      },
      {
        week: 20,
        year: 2025,
        submittedDate: '2025-05-09T16:45:00',
        deadline: '2025-05-09T18:00:00',
        status: 'rejected',
        approvedDate: null,
        rejectedDate: '2025-05-11T14:20:00',
        isLate: false
      },
      {
        week: 19,
        year: 2025,
        submittedDate: null,
        deadline: '2025-05-02T18:00:00',
        status: 'pending',
        approvedDate: null,
        rejectedDate: null,
        isLate: false
      }
    ],
    
    // Approver data (when user is approver)
    pendingApprovals: 5,
    
    // Time allocation data
    weeklyHours: {
      total: 42.5,
      breakdown: [
        {
          client: 'Acme Corp',
          hours: 25.0,
          projects: [
            {
              name: 'Website Redesign',
              hours: 15.0,
              tasks: [
                { name: 'Homepage Layout', hours: 8.0 },
                { name: 'Navigation Menu', hours: 7.0 }
              ]
            },
            {
              name: 'Mobile App',
              hours: 10.0,
              tasks: [
                { name: 'User Authentication', hours: 6.0 },
                { name: 'Payment Integration', hours: 4.0 }
              ]
            }
          ]
        },
        {
          client: 'Beta Solutions',
          hours: 17.5,
          projects: [
            {
              name: 'Database Migration',
              hours: 17.5,
              tasks: [
                { name: 'Data Analysis', hours: 10.0 },
                { name: 'Script Development', hours: 7.5 }
              ]
            }
          ]
        }
      ]
    },
    
    ytdHours: {
      total: 486.0,
      breakdown: [
        {
          client: 'Acme Corp',
          hours: 298.5,
          projects: [
            { name: 'Website Redesign', hours: 156.0 },
            { name: 'Mobile App', hours: 142.5 }
          ]
        },
        {
          client: 'Beta Solutions',
          hours: 187.5,
          projects: [
            { name: 'Database Migration', hours: 105.0 },
            { name: 'Security Audit', hours: 82.5 }
          ]
        }
      ]
    },
    
    // Performance metrics
    performance: {
      onTimeSubmissions: 18,
      totalSubmissions: 22,
      onTimeApprovals: 16,
      totalApprovals: 20
    }
  });

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Helper functions
  const formatWeek = (week, year) => `Week ${week}, ${year}`;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getPercentage = (numerator, denominator) => {
    if (denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100);
  };

  // Generate Updates based on timesheet status
  const generateUpdates = () => {
    const updates = [];
    
    if (userRole === 'employee') {
      timesheetData.timesheets.forEach(timesheet => {
        const weekLabel = formatWeek(timesheet.week, timesheet.year);
        
        switch (timesheet.status) {
          case 'pending':
            updates.push({
              type: 'warning',
              message: `Your timesheet for ${weekLabel} is pending submission.`,
              actionRequired: true
            });
            break;
            
          case 'submitted':
            if (timesheet.isLate) {
              updates.push({
                type: 'warning',
                message: `Your timesheet for ${weekLabel} was submitted late.`,
                actionRequired: false
              });
            } else {
              updates.push({
                type: 'success',
                message: `Your timesheet for ${weekLabel} was submitted on time.`,
                actionRequired: false
              });
            }
            updates.push({
              type: 'info',
              message: `Your timesheet for ${weekLabel} is awaiting approval.`,
              actionRequired: false
            });
            break;
            
          case 'approved':
            if (timesheet.isLate) {
              updates.push({
                type: 'warning',
                message: `Your timesheet for ${weekLabel} was submitted late.`,
                actionRequired: false
              });
            } else {
              updates.push({
                type: 'success',
                message: `Your timesheet for ${weekLabel} was submitted on time.`,
                actionRequired: false
              });
            }
            updates.push({
              type: 'success',
              message: `Your timesheet for ${weekLabel} was approved on ${formatDate(timesheet.approvedDate)}.`,
              actionRequired: false
            });
            break;
            
          case 'rejected':
            updates.push({
              type: 'error',
              message: `Your timesheet for ${weekLabel} was rejected. Please review and resubmit.`,
              actionRequired: true
            });
            break;
        }
      });
    } else if (userRole === 'approver') {
      updates.push({
        type: 'info',
        message: `You have ${timesheetData.pendingApprovals} timesheets pending your review and approval.`,
        actionRequired: true
      });
    }
    
    return updates.slice(0, 10); // Limit to recent updates
  };

  const updates = generateUpdates();
  
  const getUpdateStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-green-400 bg-green-50';
      case 'warning':
        return 'border-l-4 border-yellow-400 bg-yellow-50';
      case 'error':
        return 'border-l-4 border-red-400 bg-red-50';
      case 'info':
        return 'border-l-4 border-blue-400 bg-blue-50';
      default:
        return 'border-l-4 border-gray-400 bg-gray-50';
    }
  };

  const onTimeSubmissionPercentage = getPercentage(
    timesheetData.performance.onTimeSubmissions,
    timesheetData.performance.totalSubmissions
  );
  
  const onTimeApprovalPercentage = getPercentage(
    timesheetData.performance.onTimeApprovals,
    timesheetData.performance.totalApprovals
  );

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
          <div className="mb-4">
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full px-3 py-1 text-sm bg-blue-800 border border-blue-700 rounded text-white"
            >
              <option value="employee">Employee View</option>
              <option value="approver">Approver View</option>
            </select>
          </div>
        </div>
        
        <nav className="flex-1">
          <div className="px-3 py-2 bg-blue-800 text-white border-l-4 border-white flex items-center">
            <Clock className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </div>
          
          <div className="px-3 py-2 text-blue-200 hover:bg-blue-800 cursor-pointer flex items-center">
            <Calendar className="w-5 h-5 mr-3" />
            <span>Timesheet</span>
          </div>
          
          <div className="px-3 py-2 text-blue-200 hover:bg-blue-800 cursor-pointer flex items-center">
            <CheckCircle className="w-5 h-5 mr-3" />
            <span>My Tasks</span>
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
              <h2 className="text-xl font-semibold text-gray-800">Dashboard - Updates & Facts</h2>
              <div className="text-sm text-gray-500 ml-4">
                <div className="font-medium">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SECTION 1: UPDATES */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Updates</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Timesheet submissions, approvals, and action items
                </p>
              </div>
              
              <div className="p-6">
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.filter(update => update.actionRequired).length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-red-600 mb-3">Action Required</h3>
                        <div className="space-y-3">
                          {updates.filter(update => update.actionRequired).map((update, index) => (
                            <div key={`action-${index}`} className={`p-4 rounded-lg ${getUpdateStyle(update.type)}`}>
                              <p className="text-sm font-medium text-gray-800">{update.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {updates.filter(update => !update.actionRequired).length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Recent Activity</h3>
                        <div className="space-y-3">
                          {updates.filter(update => !update.actionRequired).map((update, index) => (
                            <div key={`activity-${index}`} className={`p-4 rounded-lg ${getUpdateStyle(update.type)}`}>
                              <p className="text-sm text-gray-700">{update.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent updates</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* SECTION 2: FACTS */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Facts</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Performance data and historical metrics
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Performance Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{onTimeSubmissionPercentage}%</div>
                      <div className="text-sm text-gray-600">On-time submissions</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {timesheetData.performance.onTimeSubmissions} of {timesheetData.performance.totalSubmissions} timesheets
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{onTimeApprovalPercentage}%</div>
                      <div className="text-sm text-gray-600">On-time approvals</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {timesheetData.performance.onTimeApprovals} of {timesheetData.performance.totalApprovals} approved
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Weekly Time Allocation */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">This Week's Time Allocation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Total Hours</span>
                      <span className="text-xl font-bold text-blue-600">{timesheetData.weeklyHours.total}h</span>
                    </div>
                    <div className="space-y-3">
                      {timesheetData.weeklyHours.breakdown.map((client, index) => (
                        <div key={index} className="border-l-4 border-blue-400 pl-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{client.client}</span>
                            <span className="text-sm font-semibold text-gray-600">{client.hours}h</span>
                          </div>
                          <div className="ml-2 mt-1 space-y-1">
                            {client.projects.map((project, pIndex) => (
                              <div key={pIndex} className="flex justify-between text-sm">
                                <span className="text-gray-600">• {project.name}</span>
                                <span className="text-gray-500">{project.hours}h</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Year-to-Date Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Year-to-Date Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Total Hours</span>
                      <span className="text-xl font-bold text-purple-600">{timesheetData.ytdHours.total}h</span>
                    </div>
                    <div className="space-y-2">
                      {timesheetData.ytdHours.breakdown.map((client, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{client.client}</span>
                          <span className="font-medium text-gray-600">{client.hours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboardUpdatesAndFacts;