import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AlertTriangle, CheckCircle, Server, Activity } from 'lucide-react';

const dataTraffic = [
  { name: '00:00', uv: 4000, pv: 2400 },
  { name: '04:00', uv: 3000, pv: 1398 },
  { name: '08:00', uv: 2000, pv: 9800 },
  { name: '12:00', uv: 2780, pv: 3908 },
  { name: '16:00', uv: 1890, pv: 4800 },
  { name: '20:00', uv: 2390, pv: 3800 },
  { name: '23:59', uv: 3490, pv: 4300 },
];

const dataDevices = [
  { name: 'Online', value: 400 },
  { name: 'Warning', value: 30 },
  { name: 'Offline', value: 10 },
  { name: 'Maintenance', value: 15 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className={`p-2 rounded-full bg-opacity-20 ${color.bg}`}>
        <Icon size={20} className={color.text} />
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-500">{subtext}</div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Operations Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Devices" 
          value="455" 
          subtext="+12 added this week" 
          icon={Server} 
          color={{ bg: 'bg-blue-500', text: 'text-blue-500' }} 
        />
        <StatCard 
          title="Active Alerts" 
          value="3" 
          subtext="1 Critical, 2 Warning" 
          icon={AlertTriangle} 
          color={{ bg: 'bg-red-500', text: 'text-red-500' }} 
        />
        <StatCard 
          title="System Health" 
          value="98.5%" 
          subtext="Optimal Performance" 
          icon={CheckCircle} 
          color={{ bg: 'bg-green-500', text: 'text-green-500' }} 
        />
        <StatCard 
          title="Avg Throughput" 
          value="4.2 Gbps" 
          subtext="Peak: 8.9 Gbps" 
          icon={Activity} 
          color={{ bg: 'bg-purple-500', text: 'text-purple-500' }} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Network Traffic Analysis</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                />
                <Bar dataKey="uv" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pv" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Device Health</h3>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataDevices}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataDevices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">455</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {dataDevices.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-400">{entry.name}</span>
                </div>
                <span className="text-white font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;