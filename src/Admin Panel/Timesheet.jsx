import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {  ArrowLeft} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper to get weekday name from ISO date string
const getWeekDayName = (dateString) => {
  const date = new Date(dateString);
  return weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Sunday=0, adjust to zero-based Monday index
};

const Overview = ({ timesheets, onClientSelect }) => {
  // Aggregate total hours and count timesheets per client
  const clientData = {};
    const navigate = useNavigate();

  timesheets.forEach(ts => {
    ts.entries.forEach(entry => {
      if (!clientData[entry.clientId]) {
        clientData[entry.clientId] = { totalHours: 0, entries: 0 };
      }
      clientData[entry.clientId].totalHours += Number(entry.hours);
      clientData[entry.clientId].entries++;
    });
  });

  const clients = Object.entries(clientData);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded shadow p-6">
        <button
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back to Dashboard</span>
      </button>
      <h2 className="text-2xl font-semibold mb-4">Clients Timesheet Overview</h2>
      {clients.length === 0 ? (
        <p className="text-gray-600">No timesheet data available.</p>
      ) : (
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border border-gray-300 p-2">Client</th>
              <th className="border border-gray-300 p-2 text-center">Total Hours</th>
              <th className="border border-gray-300 p-2 text-center">Entries Count</th>
              <th className="border border-gray-300 p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(([clientId, data]) => (
              <tr key={clientId} className="hover:bg-indigo-50 cursor-pointer">
                <td className="border border-gray-300 p-2">{clientId}</td>
                <td className="border border-gray-300 p-2 text-center">{data.totalHours.toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-center">{data.entries}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                    onClick={() => onClientSelect(clientId)}
                  >
                    View Timesheet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const ClientTimesheetDetail = ({ clientId, timesheets, onBack }) => {
  const filteredEntries = [];

  // Collect all entries for the client, grouped by employee and weekStart
  timesheets.forEach(ts => {
    const clientEntries = ts.entries.filter(e => e.clientId === clientId);
    if (clientEntries.length > 0) {
      filteredEntries.push({
        employeeId: ts.employeeId,
        employeeName: ts.employeeName || ts.employeeId,
        weekStart: ts.weekStart,
        entries: clientEntries
      });
    }
  });

  // Group entries by employee -> week -> day (Monday-Sunday)
  // Prepare a map of employee -> weekStart -> day -> entries
  const groupedData = {};

  filteredEntries.forEach(({ employeeId, employeeName, weekStart, entries }) => {
    if (!groupedData[employeeId]) groupedData[employeeId] = { employeeName, weeks: {} };
    if (!groupedData[employeeId].weeks[weekStart]) groupedData[employeeId].weeks[weekStart] = {};
    entries.forEach(entry => {
      const dayName = getWeekDayName(entry.date);
      if (!groupedData[employeeId].weeks[weekStart][dayName]) {
        groupedData[employeeId].weeks[weekStart][dayName] = [];
      }
      groupedData[employeeId].weeks[weekStart][dayName].push(entry);
    });
  });

  return (
    <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
      <button
        onClick={onBack}
        className="mb-4 text-indigo-600 hover:text-indigo-900 font-semibold"
      >
        &larr; Back to Overview
      </button>
      <h2 className="text-2xl font-semibold mb-6">Timesheet Detail for Client: {clientId}</h2>

      {Object.entries(groupedData).length === 0 ? (
        <p className="text-gray-600">No detailed entries found for this client.</p>
      ) : (
        Object.entries(groupedData).map(([employeeId, empData]) => (
          <div key={employeeId} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">
              Employee: {empData.employeeName} ({employeeId})
            </h3>

            {Object.entries(empData.weeks).map(([weekStart, days]) => (
              <div key={weekStart} className="mb-6 border border-gray-300 rounded p-4">
                <h4 className="text-lg font-medium mb-3">Week Starting: {weekStart}</h4>
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="border border-gray-300 p-2">Day</th>
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Project ID</th>
                      <th className="border border-gray-300 p-2">Project Name</th>
                      <th className="border border-gray-300 p-2">Task</th>
                      <th className="border border-gray-300 p-2 text-center">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekDays.map(day => {
                      const dayEntries = days[day] || [];
                      if(dayEntries.length === 0) {
                        return (
                          <tr key={day}>
                            <td className="border border-gray-300 p-2 font-semibold">{day}</td>
                            <td className="border border-gray-300 p-2" colSpan={5}>No entries</td>
                          </tr>
                        );
                      }
                      return dayEntries.map((entry, idx) => (
                        <tr key={`${day}-${idx}`}>
                          <td className="border border-gray-300 p-2 font-semibold">{idx === 0 ? day : ''}</td>
                          <td className="border border-gray-300 p-2">{entry.date}</td>
                          <td className="border border-gray-300 p-2">{entry.projectId}</td>
                          <td className="border border-gray-300 p-2">{entry.projectName || 'N/A'}</td>
                          <td className="border border-gray-300 p-2">{entry.task}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.hours}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

const Timesheet = () => {
  const employeeId = useSelector(state => state.auth.employee_id || 'emp123');
  const firstName = useSelector(state => state.auth.first_name || 'John');
  const lastName = useSelector(state => state.auth.last_name || 'Doe');

  // Sample timesheet data, multiple clients, employees, and weeks
  // Added projectName field for display
  const [submittedTimesheets] = React.useState([
    {
      employeeId,
      employeeName: `${firstName} ${lastName}`,
      weekStart: '2023-10-02',
      entries: [
        { date: '2023-10-02', projectId: 'Project A1', projectName: 'Website Revamp', clientId: 'Client X', task: 'Development', hours: 8 },
        { date: '2023-10-03', projectId: 'Project A2', projectName: 'Mobile App', clientId: 'Client Y', task: 'Testing', hours: 4 },
        { date: '2023-10-04', projectId: 'Project B', projectName: 'Portal Upgrade', clientId: 'Client X', task: 'Design', hours: 6 },
        { date: '2023-10-05', projectId: 'Project B', projectName: 'Portal Upgrade', clientId: 'Client Z', task: 'Development', hours: 7.5 },
        { date: '2023-10-06', projectId: 'Project C', projectName: 'Backend API', clientId: 'Client X', task: 'Testing', hours: 3 },
        { date: '2023-10-07', projectId: 'Project C', projectName: 'Backend API', clientId: 'Client Y', task: 'Documentation', hours: 2 },
        { date: '2023-10-08', projectId: 'Project A1', projectName: 'Website Revamp', clientId: 'Client Y', task: 'Meetings', hours: 1 },
      ],
    },
    {
      employeeId: 'emp456',
      employeeName: 'Alice Smith',
      weekStart: '2023-10-09',
      entries: [
        { date: '2023-10-09', projectId: 'Project D', projectName: 'New Feature', clientId: 'Client Z', task: 'Research', hours: 5 },
        { date: '2023-10-10', projectId: 'Project D', projectName: 'New Feature', clientId: 'Client X', task: 'Development', hours: 7 },
        { date: '2023-10-11', projectId: 'Project E', projectName: 'Bug Fixes', clientId: 'Client Z', task: 'Testing', hours: 4 },
        { date: '2023-10-12', projectId: 'Project E', projectName: 'Bug Fixes', clientId: 'Client X', task: 'Design', hours: 6 },
      ],
    },
  ]);

  const [selectedClient, setSelectedClient] = React.useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {!selectedClient && (
        <Overview timesheets={submittedTimesheets} onClientSelect={setSelectedClient} />
      )}

      {selectedClient && (
        <ClientTimesheetDetail
          clientId={selectedClient}
          timesheets={submittedTimesheets}
          onBack={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

export default Timesheet;

