import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, BarChart3, Users, Filter, Building2, ChevronDown, Search, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ResourceUtilizationMetrics = ({ dateRange }) => {
  const [selectedClients, setSelectedClients] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [metricsData, setMetricsData] = useState({
    totalHours: 0,
    billableHours: 0,
    nonBillableHours: 0,
    billabilityRatio: 0
  });

  // Mock client data
  const [clientsData, setClientsData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const clients = [
    { id: 'all', name: 'All Clients', color: '#3B82F6' },
    { id: 'acme', name: 'Acme Corp', color: '#10B981' },
    { id: 'techstart', name: 'TechStart Inc', color: '#F59E0B' },
    { id: 'globalsoft', name: 'GlobalSoft Ltd', color: '#EF4444' },
    { id: 'innovation', name: 'Innovation Labs', color: '#8B5CF6' },
    { id: 'digital', name: 'Digital Solutions', color: '#06B6D4' }
  ];

  useEffect(() => {
    // Mock data generation based on selected clients and date range
    const generateMockData = () => {
      const mockClientsData = [
        { 
          id: 'acme', 
          name: 'Acme Corp', 
          billableHours: 245, 
          nonBillableHours: 35, 
          employees: 8,
          projects: ['Website Redesign', 'Mobile App'],
          color: '#10B981'
        },
        { 
          id: 'techstart', 
          name: 'TechStart Inc', 
          billableHours: 189, 
          nonBillableHours: 28, 
          employees: 6,
          projects: ['E-commerce Platform', 'API Development'],
          color: '#F59E0B'
        },
        { 
          id: 'globalsoft', 
          name: 'GlobalSoft Ltd', 
          billableHours: 156, 
          nonBillableHours: 22, 
          employees: 5,
          projects: ['Data Migration', 'System Integration'],
          color: '#EF4444'
        },
        { 
          id: 'innovation', 
          name: 'Innovation Labs', 
          billableHours: 134, 
          nonBillableHours: 19, 
          employees: 4,
          projects: ['AI Dashboard', 'Machine Learning'],
          color: '#8B5CF6'
        },
        { 
          id: 'digital', 
          name: 'Digital Solutions', 
          billableHours: 168, 
          nonBillableHours: 25, 
          employees: 7,
          projects: ['CRM System', 'Analytics Platform'],
          color: '#06B6D4'
        }
      ];

      const mockEmployeeData = [
        { name: 'John Smith', billableHours: 87, nonBillableHours: 13, client: 'Acme Corp' },
        { name: 'Sarah Johnson', billableHours: 92, nonBillableHours: 8, client: 'TechStart Inc' },
        { name: 'Mike Chen', billableHours: 78, nonBillableHours: 22, client: 'GlobalSoft Ltd' },
        { name: 'Emily Davis', billableHours: 85, nonBillableHours: 15, client: 'Innovation Labs' },
        { name: 'David Wilson', billableHours: 90, nonBillableHours: 10, client: 'Digital Solutions' },
        { name: 'Lisa Brown', billableHours: 83, nonBillableHours: 17, client: 'Acme Corp' },
        { name: 'Tom Anderson', billableHours: 88, nonBillableHours: 12, client: 'TechStart Inc' },
        { name: 'Anna Garcia', billableHours: 76, nonBillableHours: 24, client: 'GlobalSoft Ltd' }
      ];

      // Filter data based on selected clients
      let filteredClientsData = mockClientsData;
      let filteredEmployeeData = mockEmployeeData;

      if (!selectedClients.includes('all')) {
        const selectedClientNames = selectedClients.map(id => 
          clients.find(c => c.id === id)?.name
        ).filter(Boolean);
        
        filteredClientsData = mockClientsData.filter(client => 
          selectedClients.includes(client.id)
        );
        
        filteredEmployeeData = mockEmployeeData.filter(emp => 
          selectedClientNames.includes(emp.client)
        );
      }

      const totalBillable = filteredClientsData.reduce((sum, client) => sum + client.billableHours, 0);
      const totalNonBillable = filteredClientsData.reduce((sum, client) => sum + client.nonBillableHours, 0);
      const totalHours = totalBillable + totalNonBillable;
      const billabilityRatio = totalHours > 0 ? (totalBillable / totalHours) * 100 : 0;

      setMetricsData({
        totalHours,
        billableHours: totalBillable,
        nonBillableHours: totalNonBillable,
        billabilityRatio
      });

      setClientsData(filteredClientsData);
      setEmployeeData(filteredEmployeeData);
      
      // Prepare chart data
      const chartData = filteredClientsData.map(client => ({
        name: client.name.split(' ')[0], // Shortened name for chart
        billable: client.billableHours,
        nonBillable: client.nonBillableHours,
        employees: client.employees,
        total: client.billableHours + client.nonBillableHours
      }));
      
      setChartData(chartData);
    };

    generateMockData();
  }, [selectedClients, dateRange]);

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleClientSelection = (clientId) => {
    if (clientId === 'all') {
      setSelectedClients(['all']);
    } else {
      setSelectedClients(prev => {
        const filtered = prev.filter(id => id !== 'all');
        if (filtered.includes(clientId)) {
          const newSelection = filtered.filter(id => id !== clientId);
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          return [...filtered, clientId];
        }
      });
    }
    setIsDropdownOpen(false);
  };

  const removeClient = (clientId) => {
    setSelectedClients(prev => {
      const filtered = prev.filter(id => id !== clientId);
      return filtered.length === 0 ? ['all'] : filtered;
    });
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedClientsDisplay = () => {
    if (selectedClients.includes('all')) {
      return 'All Clients';
    }
    if (selectedClients.length === 1) {
      const client = clients.find(c => c.id === selectedClients[0]);
      return client ? client.name : 'Select clients...';
    }
    return `${selectedClients.length} clients selected`;
  };

  const pieData = clientsData.map(client => ({
    name: client.name,
    value: client.billableHours,
    color: client.color
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Resource Utilization Metrics</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {dateRange?.startDate || 'Jan 1, 2024'} - {dateRange?.endDate || 'Dec 31, 2024'}
        </div>
      </div>

      {/* Client Filter Dropdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-3">
          <Filter className="w-4 h-4 mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by Client</span>
        </div>
        
        <div className="relative">
          {/* Dropdown Trigger */}
          <div 
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-sm text-gray-700">{getSelectedClientsDisplay()}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredClients.map(client => (
                  <div
                    key={client.id}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-sm"
                    onClick={() => handleClientSelection(client.id)}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: client.color }}
                      ></div>
                      <span className="text-gray-700">{client.name}</span>
                    </div>
                    {selectedClients.includes(client.id) && (
                      <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                    )}
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                    No clients found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Clients Tags */}
        {!selectedClients.includes('all') && selectedClients.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedClients.map(clientId => {
              const client = clients.find(c => c.id === clientId);
              return client ? (
                <div
                  key={clientId}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: client.color }}
                  ></div>
                  {client.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeClient(clientId);
                    }}
                    className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Hours Logged */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {formatHours(metricsData.totalHours)}
          </div>
          <div className="text-sm text-gray-600">Total Hours Logged</div>
          <div className="text-xs text-blue-600 mt-2">
            Selected clients & projects
          </div>
        </div>

        {/* Billable Hours */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {formatHours(metricsData.billableHours)}
          </div>
          <div className="text-sm text-gray-600">Billable Hours</div>
          <div className="text-xs text-green-600 mt-2">
            Revenue-generating work
          </div>
        </div>

        {/* Non-Billable Hours */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-xs text-orange-600">Internal</div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {formatHours(metricsData.nonBillableHours)}
          </div>
          <div className="text-sm text-gray-600">Non-Billable Hours</div>
          <div className="text-xs text-orange-600 mt-2">
            Training, admin, internal
          </div>
        </div>

        {/* Billability Ratio */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className={`text-xs ${metricsData.billabilityRatio >= 70 ? 'text-green-600' : metricsData.billabilityRatio >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {metricsData.billabilityRatio >= 70 ? 'Excellent' : metricsData.billabilityRatio >= 50 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {metricsData.billabilityRatio.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Billability Ratio</div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${metricsData.billabilityRatio >= 70 ? 'bg-green-500' : metricsData.billabilityRatio >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${metricsData.billabilityRatio}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Hours by Client */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Hours by Client
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}h`, 
                  name === 'billable' ? 'Billable Hours' : 'Non-Billable Hours'
                ]}
              />
              <Bar dataKey="billable" fill="#10B981" name="billable" />
              <Bar dataKey="nonBillable" fill="#F59E0B" name="nonBillable" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Billable Hours Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Billable Hours Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}h`, 'Billable Hours']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Details Table */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Client Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Client</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Billable Hours</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Non-Billable</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Employees</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Billability %</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Projects</th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((client, index) => {
                const totalHours = client.billableHours + client.nonBillableHours;
                const billabilityPercent = (client.billableHours / totalHours) * 100;
                
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: client.color }}
                        ></div>
                        <span className="font-medium text-gray-800">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-green-600 font-medium">
                      {formatHours(client.billableHours)}
                    </td>
                    <td className="py-3 px-2 text-orange-600">
                      {formatHours(client.nonBillableHours)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-500" />
                        {client.employees}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <span className={`font-medium ${billabilityPercent >= 70 ? 'text-green-600' : billabilityPercent >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {billabilityPercent.toFixed(1)}%
                        </span>
                        <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${billabilityPercent >= 70 ? 'bg-green-500' : billabilityPercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${billabilityPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 text-xs">
                      {client.projects.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <strong>Organization Efficiency:</strong> 
            {metricsData.billabilityRatio >= 70 ? ' Excellent performance! Team is highly billable.' 
             : metricsData.billabilityRatio >= 50 ? ' Good performance. Room for improvement in billability.'
             : ' Attention needed. Consider reviewing non-billable activities.'}
          </div>
          <div className="text-xs text-gray-500">
            Target: 70%+ billability
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUtilizationMetrics;