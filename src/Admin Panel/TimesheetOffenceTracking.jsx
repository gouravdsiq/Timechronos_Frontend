import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingDown, TrendingUp, Calendar, Award, Target } from 'lucide-react';

const TimesheetOffenseTracking = ({ dateRange }) => {
  const [offenderData, setOffenderData] = useState([]);
  const [organizationTrend, setOrganizationTrend] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Mock data for offenders
  useEffect(() => {
    const mockOffenders = [
      {
        id: 1,
        name: 'Kevin Zhang',
        avatar: 'KZ',
        totalOffenses: 8,
        chronicOffender: true,
        lastOffenseDate: '2024-05-15',
        averageDelay: 2.5,
        weeklyTrend: [
          { week: 'W1', status: 'late', delay: 1 },
          { week: 'W2', status: 'ontime', delay: 0 },
          { week: 'W3', status: 'missing', delay: 0 },
          { week: 'W4', status: 'late', delay: 3 },
          { week: 'W5', status: 'late', delay: 2 },
          { week: 'W6', status: 'ontime', delay: 0 },
          { week: 'W7', status: 'missing', delay: 0 },
          { week: 'W8', status: 'late', delay: 1 }
        ]
      },
      {
        id: 2,
        name: 'Amanda Foster',
        avatar: 'AF',
        totalOffenses: 6,
        chronicOffender: true,
        lastOffenseDate: '2024-05-12',
        averageDelay: 1.8,
        weeklyTrend: [
          { week: 'W1', status: 'ontime', delay: 0 },
          { week: 'W2', status: 'late', delay: 2 },
          { week: 'W3', status: 'ontime', delay: 0 },
          { week: 'W4', status: 'late', delay: 1 },
          { week: 'W5', status: 'missing', delay: 0 },
          { week: 'W6', status: 'late', delay: 3 },
          { week: 'W7', status: 'ontime', delay: 0 },
          { week: 'W8', status: 'late', delay: 1 }
        ]
      },
      {
        id: 3,
        name: 'Robert Brown',
        avatar: 'RB',
        totalOffenses: 4,
        chronicOffender: true,
        lastOffenseDate: '2024-05-18',
        averageDelay: 1.2,
        weeklyTrend: [
          { week: 'W1', status: 'ontime', delay: 0 },
          { week: 'W2', status: 'ontime', delay: 0 },
          { week: 'W3', status: 'late', delay: 1 },
          { week: 'W4', status: 'ontime', delay: 0 },
          { week: 'W5', status: 'late', delay: 2 },
          { week: 'W6', status: 'ontime', delay: 0 },
          { week: 'W7', status: 'late', delay: 1 },
          { week: 'W8', status: 'ontime', delay: 0 }
        ]
      },
      {
        id: 4,
        name: 'Sophie Taylor',
        avatar: 'ST',
        totalOffenses: 3,
        chronicOffender: true,
        lastOffenseDate: '2024-05-10',
        averageDelay: 0.8,
        weeklyTrend: [
          { week: 'W1', status: 'ontime', delay: 0 },
          { week: 'W2', status: 'ontime', delay: 0 },
          { week: 'W3', status: 'ontime', delay: 0 },
          { week: 'W4', status: 'late', delay: 1 },
          { week: 'W5', status: 'ontime', delay: 0 },
          { week: 'W6', status: 'late', delay: 1 },
          { week: 'W7', status: 'ontime', delay: 0 },
          { week: 'W8', status: 'late', delay: 1 }
        ]
      },
      {
        id: 5,
        name: 'James Wilson',
        avatar: 'JW',
        totalOffenses: 2,
        chronicOffender: false,
        lastOffenseDate: '2024-05-20',
        averageDelay: 0.5,
        weeklyTrend: [
          { week: 'W1', status: 'ontime', delay: 0 },
          { week: 'W2', status: 'ontime', delay: 0 },
          { week: 'W3', status: 'ontime', delay: 0 },
          { week: 'W4', status: 'ontime', delay: 0 },
          { week: 'W5', status: 'ontime', delay: 0 },
          { week: 'W6', status: 'late', delay: 1 },
          { week: 'W7', status: 'ontime', delay: 0 },
          { week: 'W8', status: 'ontime', delay: 0 }
        ]
      }
    ];

    const mockOrgTrend = [
      { week: 'W1', onTime: 85, late: 10, missing: 5 },
      { week: 'W2', onTime: 82, late: 12, missing: 6 },
      { week: 'W3', onTime: 78, late: 15, missing: 7 },
      { week: 'W4', onTime: 80, late: 13, missing: 7 },
      { week: 'W5', onTime: 77, late: 16, missing: 7 },
      { week: 'W6', onTime: 83, late: 11, missing: 6 },
      { week: 'W7', onTime: 86, late: 9, missing: 5 },
      { week: 'W8', onTime: 88, late: 8, missing: 4 }
    ];

    setOffenderData(mockOffenders);
    setOrganizationTrend(mockOrgTrend);
  }, [dateRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ontime': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'missing': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ontime': return 'On Time';
      case 'late': return 'Late';
      case 'missing': return 'Missing';
      default: return 'Unknown';
    }
  };

  const getTrendDirection = (trend) => {
    const recent = trend.slice(-3);
    const onTimeCount = recent.filter(w => w.status === 'ontime').length;
    return onTimeCount >= 2 ? 'improving' : 'declining';
  };

  const chronicOffenders = offenderData.filter(emp => emp.chronicOffender);
  const regularOffenders = offenderData.filter(emp => !emp.chronicOffender);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Timesheet Offense Tracking</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{chronicOffenders.length}</div>
                <div className="text-sm text-gray-600">Chronic Offenders</div>
                <div className="text-xs text-red-600">3+ offenses</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{regularOffenders.length}</div>
                <div className="text-sm text-gray-600">Regular Offenders</div>
                <div className="text-xs text-yellow-600">1-2 offenses</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{offenderData.length}</div>
                <div className="text-sm text-gray-600">Total Offenders</div>
                <div className="text-xs text-blue-600">All offenses</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-800">{offenderData.filter(emp => emp.averageDelay < 1).length}</div>
                <div className="text-sm text-gray-600">On Time</div>
                <div className="text-xs text-green-600">Average delay &lt; 1 hour</div>
              </div>
            </div>
          </div>
        </div>

        {/* Offender List */}
        <div className="space-y-4">
          {offenderData.map(offender => (
            <div
              key={offender.id}
              className={`bg-white rounded-lg shadow p-4 flex items-center justify-between cursor-pointer ${
                selectedEmployee?.id === offender.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedEmployee(offender)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold`}>
                  {offender.avatar}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold text-gray-800">{offender.name}</div>
                  <div className="text-sm text-gray-600">Total Offenses: {offender.totalOffenses}</div>
                  <div className="text-sm text-gray-600">Last Offense: {offender.lastOffenseDate}</div>
                </div>
              </div>
              <div className={`p-2 rounded ${getStatusColor(offender.averageDelay < 1 ? 'ontime' : 'late')}`}>
                {getStatusText(offender.averageDelay < 1 ? 'ontime' : 'late')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Organization Trend</h2>
        <div className="space-y-4">
          {organizationTrend.map(trend => (
            <div key={trend.week} className="flex justify-between bg-gray-100 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-800">{trend.week}</div>
              <div className="flex space-x-4">
                <div className="text-green-600">{trend.onTime}% On Time</div>
                <div className="text-yellow-600">{trend.late}% Late</div>
                <div className="text-red-600">{trend.missing}% Missing</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Employee Weekly Trend Details */}
      {selectedEmployee && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Trend: {selectedEmployee.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
            {selectedEmployee.weeklyTrend.map((week) => (
              <div key={week.week} className="flex flex-col items-center">
                <div className={`${getStatusColor(week.status)} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}>
                  {week.status === 'ontime' ? <TrendingUp size={16} /> : week.status === 'late' ? <TrendingDown size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div className="text-sm mt-1 font-semibold">{week.week}</div>
                <div className="text-xs text-gray-600">{week.status === 'missing' ? 'Missing' : `${week.delay}h`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetOffenseTracking;

