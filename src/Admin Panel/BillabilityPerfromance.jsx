import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Users, Settings } from 'lucide-react';

const BillabilityPerformance = ({ dateRange }) => {
  const [billabilityThreshold, setBillabilityThreshold] = useState(40);
  const [showThresholdSettings, setShowThresholdSettings] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);

  // Mock employee billability data
  useEffect(() => {
    const mockData = [
      { id: 1, name: 'Sarah Johnson', totalHours: 45, billableHours: 38, billabilityPercent: 84.4, avatar: 'SJ' },
      { id: 2, name: 'David Miller', totalHours: 42, billableHours: 35, billabilityPercent: 83.3, avatar: 'DM' },
      { id: 3, name: 'Alex Wong', totalHours: 40, billableHours: 32, billabilityPercent: 80.0, avatar: 'AW' },
      { id: 4, name: 'Emma Davis', totalHours: 38, billableHours: 29, billabilityPercent: 76.3, avatar: 'ED' },
      { id: 5, name: 'Michael Chen', totalHours: 44, billableHours: 33, billabilityPercent: 75.0, avatar: 'MC' },
      { id: 6, name: 'Lisa Rodriguez', totalHours: 41, billableHours: 28, billabilityPercent: 68.3, avatar: 'LR' },
      { id: 7, name: 'James Wilson', totalHours: 39, billableHours: 25, billabilityPercent: 64.1, avatar: 'JW' },
      { id: 8, name: 'Nina Patel', totalHours: 37, billableHours: 22, billabilityPercent: 59.5, avatar: 'NP' },
      { id: 9, name: 'Robert Brown', totalHours: 43, billableHours: 18, billabilityPercent: 41.9, avatar: 'RB' },
      { id: 10, name: 'Amanda Foster', totalHours: 36, billableHours: 12, billabilityPercent: 33.3, avatar: 'AF' },
      { id: 11, name: 'Kevin Zhang', totalHours: 35, billableHours: 10, billabilityPercent: 28.6, avatar: 'KZ' },
      { id: 12, name: 'Sophie Taylor', totalHours: 40, billableHours: 8, billabilityPercent: 20.0, avatar: 'ST' }
    ];
    
    setEmployeeData(mockData);
  }, [dateRange]);

  const topPerformers = employeeData
    .filter(emp => emp.billabilityPercent >= billabilityThreshold)
    .sort((a, b) => b.billableHours - a.billableHours)
    .slice(0, 6);

  const lowPerformers = employeeData
    .filter(emp => emp.billabilityPercent < billabilityThreshold)
    .sort((a, b) => a.billabilityPercent - b.billabilityPercent);

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBarColor = (percentage) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Billability Performance Analytics</h2>
          <button
            onClick={() => setShowThresholdSettings(!showThresholdSettings)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>

        {/* Threshold Settings */}
        {showThresholdSettings && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Billability Threshold:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={billabilityThreshold}
                  onChange={(e) => setBillabilityThreshold(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-semibold text-gray-800 w-12">
                  {billabilityThreshold}%
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Employees below this threshold will be flagged as low performers
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{topPerformers.length}</div>
                <div className="text-sm text-gray-600">High Performers</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{lowPerformers.length}</div>
                <div className="text-sm text-gray-600">Below Threshold</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{employeeData.length}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Billable Resources */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Top Billable Performers</h3>
          </div>
          
          <div className="space-y-4">
            {topPerformers.map((employee, index) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-xs font-semibold mr-3">
                    #{index + 1}
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-full font-medium mr-3">
                    {employee.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{employee.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatHours(employee.billableHours)} billable / {formatHours(employee.totalHours)} total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getPerformanceColor(employee.billabilityPercent)}`}>
                    {employee.billabilityPercent.toFixed(1)}%
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full ${getPerformanceBarColor(employee.billabilityPercent)}`}
                      style={{ width: `${employee.billabilityPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Billable Resources */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              Low Billable Performers 
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Below {billabilityThreshold}%)
              </span>
            </h3>
          </div>
          
          {lowPerformers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <div className="text-lg font-medium">Excellent Performance!</div>
              <div className="text-sm">All employees are above the billability threshold</div>
            </div>
          ) : (
            <div className="space-y-4">
              {lowPerformers.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-full font-medium mr-3">
                      {employee.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{employee.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatHours(employee.billableHours)} billable / {formatHours(employee.totalHours)} total
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getPerformanceColor(employee.billabilityPercent)}`}>
                      {employee.billabilityPercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {(billabilityThreshold - employee.billabilityPercent).toFixed(1)}% below target
                    </div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full ${getPerformanceBarColor(employee.billabilityPercent)}`}
                        style={{ width: `${employee.billabilityPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillabilityPerformance;