import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ChatVisualizer = ({ data, type = 'chart' }) => {
  const [activeTab, setActiveTab] = useState('chart');

  const tabs = [
    { id: 'chart', label: 'Chart' },
    { id: 'table', label: 'Table' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'chart' && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 p-4 flex justify-between">
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatVisualizer;