import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react';

const ResourceUtilizationMetrics = ({ dateRange }) => {
  // Sample data - in real app, this would come from API
  const [metricsData, setMetricsData] = useState({
    totalHours: 0,
    billableHours: 0,
    nonBillableHours: 0,
    billabilityRatio: 0
  });

  useEffect(() => {
    // Simulate API call based on date range
    const fetchMetrics = () => {
      // Mock data calculation based on date range
      const totalHours = 1247;
      const billableHours = 892;
      const nonBillableHours = totalHours - billableHours;
      const billabilityRatio = (billableHours / totalHours) * 100;

      setMetricsData({
        totalHours,
        billableHours,
        nonBillableHours,
        billabilityRatio
      });
    };

    fetchMetrics();
  }, [dateRange]);

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Resource Utilization Metrics</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {dateRange.startDate} - {dateRange.endDate}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Across all employees & projects
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

      {/* Additional Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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