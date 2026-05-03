import { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../api/client';
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <ClipboardList size={28} className="text-white" />,
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20'
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: <CheckCircle2 size={28} className="text-white" />,
      bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/20'
    },
    {
      title: 'Pending',
      value: stats.pendingTasks,
      icon: <Clock size={28} className="text-white" />,
      bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      shadow: 'shadow-orange-500/20'
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: <AlertCircle size={28} className="text-white" />,
      bg: 'bg-gradient-to-br from-red-500 to-rose-600',
      shadow: 'shadow-red-500/20'
    }
  ];

  if (loading) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
        <p className="mt-1 text-sm text-gray-400">Here is an overview of your projects and tasks.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-white/0 blur-2xl transition-all group-hover:scale-150" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-lg ${stat.bg} ${stat.shadow}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Timeline */}
      <div className="mt-8 rounded-2xl border border-gray-800 bg-surface p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="relative border-l border-gray-800 ml-4 space-y-8 pb-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity._id} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-surface bg-primary ring-4 ring-primary/20" />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{activity.user?.name}</span>{' '}
                      {activity.description}
                    </p>
                  </div>
                  <div className="mt-1 sm:mt-0 flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-background/50">
            <ClipboardList size={32} className="text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-400">No recent activity found.</p>
            <p className="text-xs text-gray-500 mt-1">Activities like creating projects or tasks will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
