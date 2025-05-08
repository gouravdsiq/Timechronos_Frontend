export default function RecentActivityModal({ activityList, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">All Recent Activities</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              Close
            </button>
          </div>
  
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Employee</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Project</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activityList.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">{activity.name}</td>
                    <td className="px-4 py-2">{activity.action}</td>
                    <td className="px-4 py-2">{activity.project}</td>
                    <td className="px-4 py-2 text-gray-500">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  