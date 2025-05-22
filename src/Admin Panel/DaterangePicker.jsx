import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DateRangePicker = ({ onDateRangeChange, initialRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(initialRange || 'last7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const predefinedRanges = {
    'today': 'Today',
    'yesterday': 'Yesterday',
    'last7days': 'Last 7 Days',
    'lastmonth': 'Last Month',
    'custom': 'Custom Range'
  };

  const getDateRange = (range) => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        return {
          startDate: formatDate(today),
          endDate: formatDate(today),
          label: 'Today'
        };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: formatDate(yesterday),
          endDate: formatDate(yesterday),
          label: 'Yesterday'
        };
      case 'last7days':
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        return {
          startDate: formatDate(last7),
          endDate: formatDate(today),
          label: 'Last 7 Days'
        };
      case 'lastmonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          startDate: formatDate(lastMonthStart),
          endDate: formatDate(lastMonthEnd),
          label: 'Last Month'
        };
      case 'custom':
        return {
          startDate: customStartDate,
          endDate: customEndDate,
          label: `${customStartDate} to ${customEndDate}`
        };
      default:
        return {
          startDate: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(today),
          label: 'Last 7 Days'
        };
    }
  };

  const handleRangeSelect = (range) => {
    if (range === 'custom') {
      setSelectedRange(range);
      return;
    }

    setSelectedRange(range);
    const dateRange = getDateRange(range);
    onDateRangeChange(dateRange);
    setIsOpen(false);
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const dateRange = getDateRange('custom');
      onDateRangeChange(dateRange);
      setIsOpen(false);
    }
  };

  const getCurrentLabel = () => {
    if (selectedRange === 'custom' && customStartDate && customEndDate) {
      return `${customStartDate} to ${customEndDate}`;
    }
    return predefinedRanges[selectedRange] || 'Last 7 Days';
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm min-w-36"
      >
        <Calendar className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
        <span className="font-medium text-gray-700 truncate flex-1">{getCurrentLabel()}</span>
        <ChevronDown className={`w-4 h-4 ml-2 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="space-y-1 mb-3">
              {Object.entries(predefinedRanges).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleRangeSelect(key)}
                  className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                    selectedRange === key
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {selectedRange === 'custom' && (
              <div className="border-t pt-3">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      min={customStartDate}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCustomRangeApply}
                      disabled={!customStartDate || !customEndDate}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Demo component to show how it works
const Demo = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    console.log('Selected date range:', dateRange);
  };

  return (
    <div className="p-8 space-y-4">
      <div>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>
      
      {/* {selectedDateRange && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Selected Range:</h3>
          <p><strong>Label:</strong> {selectedDateRange.label}</p>
          <p><strong>Start Date:</strong> {selectedDateRange.startDate}</p>
          <p><strong>End Date:</strong> {selectedDateRange.endDate}</p>
        </div>
      )} */}
    </div>
  );
};

export default Demo;