import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Bell, Users, Target, Award, AlertCircle, CheckCircle } from 'lucide-react';

const InsightsRecommendations = ({ dateRange }) => {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [teamStats, setTeamStats] = useState({});

  useEffect(() => {
    // Generate insights based on mock data
    const generateInsights = () => {
      const mockInsights = [
        {
          id: 1,
          type: 'positive',
          icon: TrendingUp,
          title: 'Improved Submission Behavior',
          description: 'James Wilson and Nina Patel have shown 100% on-time submissions in the last 3 weeks.',
          employees: ['James Wilson', 'Nina Patel'],
          action: 'consider_recognition'
        },
        {
          id: 2,
          type: 'warning',
          icon: AlertCircle,
          title: 'Declining Billability Trend',
          description: 'Engineering team average billability dropped from 78% to 65% this month.',
          team: 'Engineering',
          metric: 'billability',
          action: 'review_workload'
        },
        {
          id: 3,
          type: 'success',
          icon: Award,
          title: 'Top Performing Team',
          description: 'Design team maintains 85% average billability - highest across all departments.',
          team: 'Design',
          metric: 'billability',
          action: 'share_best_practices'
        },
        {
          id: 4,
          type: 'alert',
          icon: Bell,
          title: 'Timesheet Compliance Risk',
          description: '4 employees have missed 3+ timesheet submissions. Immediate action required.',
          count: 4,
          action: 'immediate_intervention'
        }
      ];

      const mockRecommendations = [
        {
          id: 1,
          priority: 'high',
          category: 'Billability',
          title: 'Review Non-Billable Activities',
          description: 'Kevin Zhang and Amanda Foster have high non-billable hours. Review their task allocation.',
          employees: ['Kevin Zhang', 'Amanda Foster'],
          estimatedImpact: '+12% billability',
          actions: [
            'Schedule 1:1 meetings with affected employees',
            'Review current project assignments',
            'Identify opportunities to reduce admin time'
          ]
        },
        {
          id: 2,
          priority: 'medium',
          category: 'Timesheet Compliance',
          title: 'Implement Automated Reminders',
          description: 'Set up automated email/slack reminders for chronic timesheet offenders.',
          employees: ['Kevin Zhang', 'Amanda Foster', 'Robert Brown', 'Sophie Taylor'],
          estimatedImpact: '+25% compliance',
          actions: [
            'Configure automated reminder system',
            'Set up escalation for missed deadlines',
            'Create manager notification workflow'
          ]
        },
        {
          id: 3,
          priority: 'low',
          category: 'Performance Recognition',
          title: 'Recognize Top Performers',
          description: 'Acknowledge employees with excellent billability and timesheet compliance.',
          employees: ['Sarah Johnson', 'David Miller', 'Alex Wong'],
          estimatedImpact: 'Improved morale',
          actions: [
            'Send recognition emails to top performers',
            'Share success stories in team meeting',
            'Consider performance bonuses or rewards'
          ]
        },
        {
          id: 4,
          priority: 'medium',
          category: 'Team Development',
          title: 'Cross-Team Learning Session',
          description: 'Design team can share billability best practices with other teams.',
          team: 'Design → Engineering',
          estimatedImpact: '+8% org billability',
          actions: [
            'Schedule knowledge sharing session',
            'Document best practices',
            'Create standardized processes'
          ]
        }
      ];

      const mockTeamStats = {
        engineering: { billability: 65, compliance: 78, trend: 'declining' },
        design: { billability: 85, compliance: 92, trend: 'stable' },
        marketing: { billability: 72, compliance: 85, trend: 'improving' },
        sales: { billability: 68, compliance: 88, trend: 'stable' }
      };

      setInsights(mockInsights);
      setRecommendations(mockRecommendations);
      setTeamStats(mockTeamStats);
    };

    generateInsights();
  }, [dateRange]);

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200 text-green-700';
      case 'success': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'alert': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case 'stable': return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Insights & Recommendations</h2>
        </div>
        <p className="text-gray-600">
          AI-powered insights to help you identify opportunities and take proactive management actions.
        </p>
      </div>

      {/* Team Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(teamStats).map(([team, stats]) => (
            <div key={team} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 capitalize">{team}</h4>
                {getTrendIcon(stats.trend)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billability</span>
                  <span className="font-medium">{stats.billability}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Compliance</span>
                  <span className="font-medium">{stats.compliance}%</span>
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  Trend: {stats.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
        <div className="space-y-4">
          {insights.map((insight) => {
            const IconComponent = insight.icon;
            return (
              <div
                key={insight.id}
                className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start">
                  <IconComponent className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm mb-2">{insight.description}</p>
                    {insight.employees && (
                      <div className="flex items-center text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        <span>Employees: {insight.employees.join(', ')}</span>
                      </div>
                    )}
                    {insight.team && (
                      <div className="flex items-center text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        <span>Team: {insight.team}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Actions</h3>
        <div className="space-y-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)} mr-3`}>
                    {rec.priority.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {rec.category}
                  </div>
                </div>
                {rec.estimatedImpact && (
                  <div className="text-sm font-medium text-green-600">
                    {rec.estimatedImpact}
                  </div>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-2">{rec.title}</h4>
              <p className="text-gray-600 mb-3">{rec.description}</p>
              
              {rec.employees && (
                <div className="mb-3 text-sm text-gray-600">
                  <strong>Affected employees:</strong> {rec.employees.join(', ')}
                </div>
              )}
              
              {rec.team && (
                <div className="mb-3 text-sm text-gray-600">
                  <strong>Teams involved:</strong> {rec.team}
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-800 mb-2">Action Steps:</div>
                <ul className="space-y-1">
                  {rec.actions.map((action, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <Bell className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">Send Reminders</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Recognize Top Performers</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <Users className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-purple-700 font-medium">Schedule Team Meetings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsRecommendations;