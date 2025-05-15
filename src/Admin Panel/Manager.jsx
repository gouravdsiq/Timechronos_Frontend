import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, 
  Filter, Search, Calendar, ArrowLeft, AlertCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ManagerPage = () => {
  // States for manager page
  const [timesheetRequests, setTimesheetRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'submittedDate', direction: 'desc' });
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState({ start: null, end: null });
  
  // Mock data - In a real app, this would come from an API
  const mockTimesheetRequests = [
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      department: 'Development',
      project: 'Web Redesign',
      submittedDate: '2025-05-12T09:30:00',
      startDate: '2025-05-05',
      endDate: '2025-05-11',
      totalHours: 40.5,
      status: 'pending',
      entries: [
        { date: '2025-05-05', hours: 8, project: 'Web Redesign', task: 'Frontend Development' },
        { date: '2025-05-06', hours: 8.5, project: 'Web Redesign', task: 'UI Implementation' },
        { date: '2025-05-07', hours: 7.5, project: 'Web Redesign', task: 'Bug Fixes' },
        { date: '2025-05-08', hours: 8, project: 'Web Redesign', task: 'Testing' },
        { date: '2025-05-09', hours: 8.5, project: 'Web Redesign', task: 'Documentation' }
      ]
    },
    {
      id: 2,
      employeeName: 'David Miller',
      employeeId: 'EMP002',
      department: 'Design',
      project: 'Mobile App',
      submittedDate: '2025-05-13T10:15:00',
      startDate: '2025-05-05',
      endDate: '2025-05-11',
      totalHours: 39,
      status: 'pending',
      entries: [
        { date: '2025-05-05', hours: 8, project: 'Mobile App', task: 'UI Design' },
        { date: '2025-05-06', hours: 7, project: 'Mobile App', task: 'Wireframing' },
        { date: '2025-05-07', hours: 8, project: 'Mobile App', task: 'Prototyping' },
        { date: '2025-05-08', hours: 8, project: 'Mobile App', task: 'User Testing' },
        { date: '2025-05-09', hours: 8, project: 'Mobile App', task: 'Design Revisions' }
      ]
    },
    {
      id: 3,
      employeeName: 'Alex Wong',
      employeeId: 'EMP003',
      department: 'Marketing',
      project: 'Client Portal',
      submittedDate: '2025-05-10T14:20:00',
      startDate: '2025-05-03',
      endDate: '2025-05-09',
      totalHours: 42,
      status: 'approved',
      approvedDate: '2025-05-11T09:45:00',
      entries: [
        { date: '2025-05-03', hours: 8, project: 'Client Portal', task: 'Content Strategy' },
        { date: '2025-05-04', hours: 6, project: 'Client Portal', task: 'Content Creation' },
        { date: '2025-05-05', hours: 9, project: 'Client Portal', task: 'SEO Optimization' },
        { date: '2025-05-06', hours: 8, project: 'Client Portal', task: 'Analytics Setup' },
        { date: '2025-05-07', hours: 7, project: 'Client Portal', task: 'Report Generation' },
        { date: '2025-05-08', hours: 4, project: 'Client Portal', task: 'Client Meeting' }
      ]
    },
    {
      id: 4,
      employeeName: 'Emma Davis',
      employeeId: 'EMP004',
      department: 'Development',
      project: 'E-commerce Platform',
      submittedDate: '2025-05-08T16:45:00',
      startDate: '2025-05-01',
      endDate: '2025-05-07',
      totalHours: 37.5,
      status: 'rejected',
      rejectedDate: '2025-05-09T11:30:00',
      rejectionReason: 'Missing details for May 3rd tasks. Please add task descriptions and resubmit.',
      entries: [
        { date: '2025-05-01', hours: 8, project: 'E-commerce Platform', task: 'Backend Development' },
        { date: '2025-05-02', hours: 7.5, project: 'E-commerce Platform', task: 'API Integration' },
        { date: '2025-05-03', hours: 6, project: 'E-commerce Platform', task: '' },
        { date: '2025-05-04', hours: 0, project: 'E-commerce Platform', task: 'Day Off' },
        { date: '2025-05-05', hours: 8, project: 'E-commerce Platform', task: 'Database Optimization' },
        { date: '2025-05-06', hours: 8, project: 'E-commerce Platform', task: 'Testing' }
      ]
    },
    {
      id: 5,
      employeeName: 'Harshit Jain',
      employeeId: 'EMP005',
      department: 'QA',
      project: 'Internal Tools',
      submittedDate: '2025-05-13T08:30:00',
      startDate: '2025-05-06',
      endDate: '2025-05-12',
      totalHours: 41,
      status: 'pending',
      entries: [
        { date: '2025-05-06', hours: 8, project: 'Internal Tools', task: 'Test Planning' },
        { date: '2025-05-07', hours: 8, project: 'Internal Tools', task: 'Automation Setup' },
        { date: '2025-05-08', hours: 9, project: 'Internal Tools', task: 'Test Execution' },
        { date: '2025-05-09', hours: 8, project: 'Internal Tools', task: 'Bug Reporting' },
        { date: '2025-05-10', hours: 8, project: 'Internal Tools', task: 'Regression Testing' }
      ]
    }
  ];

  // Get user data from Redux store
  const first_name = useSelector((state) => state.auth?.first_name || '');
  const email = useSelector((state) => state.auth?.email || '');

  // Load mock data on component mount
  useEffect(() => {
    setTimesheetRequests(mockTimesheetRequests);
    setFilteredRequests(mockTimesheetRequests);
  }, []);

  // Format date string to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format datetime string to readable format with time
  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  // Apply sorting to requests
  const requestSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedRequests = [...filteredRequests].sort((a, b) => {
      if (key === 'totalHours') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      } else if (key === 'submittedDate') {
        return direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key]) 
          : new Date(b[key]) - new Date(a[key]);
      } else {
        return direction === 'asc'
          ? a[key].toString().localeCompare(b[key].toString())
          : b[key].toString().localeCompare(a[key].toString());
      }
    });
    
    setFilteredRequests(sortedRequests);
  };

  // Get the sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  // Filter requests based on search, status, and date range
  useEffect(() => {
    let results = [...timesheetRequests];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        request => 
          request.employeeName.toLowerCase().includes(query) ||
          request.employeeId.toLowerCase().includes(query) ||
          request.project.toLowerCase().includes(query) ||
          request.department.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      results = results.filter(request => request.status === filterStatus);
    }
    
    // Filter by date range
    if (filterDateRange.start && filterDateRange.end) {
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      
      results = results.filter(request => {
        const submittedDate = new Date(request.submittedDate);
        return submittedDate >= startDate && submittedDate <= endDate;
      });
    }
    
    setFilteredRequests(results);
  }, [searchQuery, filterStatus, filterDateRange, timesheetRequests]);

  // View timesheet details
  const viewTimesheetDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Handle approval of timesheet
  const handleApprove = (requestId) => {
    const updatedRequests = timesheetRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'approved',
          approvedDate: new Date().toISOString()
        };
      }
      return request;
    });
    
    setTimesheetRequests(updatedRequests);
    setFilteredRequests(prevFiltered => 
      prevFiltered.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', approvedDate: new Date().toISOString() } 
          : request
      )
    );
    
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  // Open rejection modal
  const openRejectionModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  // Handle rejection of timesheet with reason
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    const updatedRequests = timesheetRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: 'rejected',
          rejectedDate: new Date().toISOString(),
          rejectionReason: rejectionReason
        };
      }
      return request;
    });
    
    setTimesheetRequests(updatedRequests);
    setFilteredRequests(prevFiltered => 
      prevFiltered.map(request => 
        request.id === selectedRequest.id 
          ? { 
              ...request, 
              status: 'rejected', 
              rejectedDate: new Date().toISOString(),
              rejectionReason: rejectionReason 
            } 
          : request
      )
    );
    
    setShowRejectionModal(false);
    setShowDetailsModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDateRange({ start: null, end: null });
    setFilteredRequests(timesheetRequests);
  };

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    timesheetRequests.forEach(request => {
      counts[request.status] = counts[request.status] + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 border-b">
        <button
                onClick={() => navigate('/admin-dashboard')}
                className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
                <span>Back to Dashboard</span>
              </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Timesheet Management</h1>
          {/* <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome, {first_name}</span>
            <span className="text-xs text-gray-500">({email})</span>
          </div> */}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Status summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-yellow-700 font-medium">Pending Requests</h3>
                <div className="text-2xl font-bold mt-1">{statusCounts.pending}</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-400">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-green-700 font-medium">Approved Timesheets</h3>
                <div className="text-2xl font-bold mt-1">{statusCounts.approved}</div>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-red-700 font-medium">Rejected Timesheets</h3>
                <div className="text-2xl font-bold mt-1">{statusCounts.rejected}</div>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by employee name, ID, project..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setExpandedFilters(!expandedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {expandedFilters ? 'Hide Filters' : 'More Filters'}
                {expandedFilters ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {expandedFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={filterDateRange.start || ''}
                      onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={filterDateRange.end || ''}
                      onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-end justify-end">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timesheet requests table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Timesheet Requests</h2>
          </div>
          
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('employeeName')}
                    >
                      <div className="flex items-center">
                        Employee
                        {getSortDirectionIndicator('employeeName')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('project')}
                    >
                      <div className="flex items-center">
                        Project
                        {getSortDirectionIndicator('project')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('department')}
                    >
                      <div className="flex items-center">
                        Department
                        {getSortDirectionIndicator('department')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('submittedDate')}
                    >
                      <div className="flex items-center">
                        Submitted
                        {getSortDirectionIndicator('submittedDate')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('totalHours')}
                    >
                      <div className="flex items-center">
                        Hours
                        {getSortDirectionIndicator('totalHours')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortDirectionIndicator('status')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                            <div className="text-xs text-gray-500">{request.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.project}</div>
                        <div className="text-xs text-gray-500">{formatDate(request.startDate)} - {formatDate(request.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(request.submittedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {request.totalHours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === 'pending' && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                        {request.status === 'approved' && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => viewTimesheetDetails(request)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View
                        </button>
                        
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => openRejectionModal(request)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-gray-500">
              <AlertCircle className="w-12 h-12 mb-3 text-gray-400" />
              <p className="text-lg">No timesheet requests found</p>
              <p className="text-sm mt-1">Try changing your filters or search query</p>
            </div>
          )}
        </div>
      </div>

      {/* Timesheet Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Timesheet Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200"
                aria-label="Close modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Employee Information</h4>
                  <p><strong>Name:</strong> {selectedRequest.employeeName}</p>
                  <p><strong>Employee ID:</strong> {selectedRequest.employeeId}</p>
                  <p><strong>Department:</strong> {selectedRequest.department}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Timesheet Period</h4>
                  <p><strong>Project:</strong> {selectedRequest.project}</p>
                  <p><strong>Submitted:</strong> {formatDateTime(selectedRequest.submittedDate)}</p>
                  <p><strong>Period:</strong> {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}</p>
                  <p><strong>Total Hours:</strong> {selectedRequest.totalHours}h</p>
                  <p><strong>Status:</strong> {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}</p>
                  {selectedRequest.status === 'approved' && selectedRequest.approvedDate && (
                    <p><strong>Approved On:</strong> {formatDateTime(selectedRequest.approvedDate)}</p>
                  )}
                  {selectedRequest.status === 'rejected' && (
                    <>
                      <p><strong>Rejected On:</strong> {selectedRequest.rejectedDate ? formatDateTime(selectedRequest.rejectedDate) : '-'}</p>
                      <p><strong>Rejection Reason:</strong> {selectedRequest.rejectionReason || '-'}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Time Entries</h4>
                <table className="min-w-full table-auto border border-gray-300 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-600">Hours</th>
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-600">Project</th>
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-600">Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.entries.map((entry, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border px-4 py-2 text-sm">{formatDate(entry.date)}</td>
                        <td className="border px-4 py-2 text-sm">{entry.hours}</td>
                        <td className="border px-4 py-2 text-sm">{entry.project}</td>
                        <td className="border px-4 py-2 text-sm">{entry.task || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[70vh] overflow-y-auto flex flex-col">
            <h3 className="text-lg font-medium mb-4">Reject Timesheet for {selectedRequest.employeeName}</h3>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide reason for rejection"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition duration-200"
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
                onClick={handleReject}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
