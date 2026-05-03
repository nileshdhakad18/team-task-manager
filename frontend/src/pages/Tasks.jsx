import { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { CheckSquare, Clock, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Task Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('/tasks'),
        axios.get('/projects')
      ]);
      setTasks(tasksRes.data.data);
      setProjects(projectsRes.data.data);

      if (user?.role === 'Admin') {
        const usersRes = await axios.get('/users');
        setAllUsers(usersRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/projects/${selectedProject}/tasks`, {
        title,
        description,
        deadline,
        assignedTo
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setDeadline('');
      setAssignedTo('');
      setSelectedProject('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesProject = projectFilter === 'All' || (task.project && task.project._id === projectFilter);
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [tasks, searchQuery, statusFilter, projectFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckSquare size={16} className="text-green-500" />;
      case 'In Progress': return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  if (loading) return <div className="text-gray-400">Loading tasks...</div>;

  const isOverdue = (deadlineStr, status) => {
    return new Date(deadlineStr) < new Date() && status !== 'Completed';
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Task Board</h1>
          <p className="mt-1 text-sm text-gray-400">Manage and track your assigned tasks across projects.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
          >
            <Plus size={18} className="mr-2" />
            Create Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-gray-800 bg-surface/50 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              className="appearance-none rounded-xl border border-gray-800 bg-surface/50 py-3 pl-10 pr-10 text-sm text-white outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary shadow-sm"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0 overflow-x-auto pb-4">
        {filteredTasks.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-surface/30">
            <CheckSquare size={48} className="mb-4 text-gray-600" />
            <h3 className="text-lg font-medium text-white">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">Adjust your search or create a new task.</p>
          </div>
        ) : (
          <div className="flex h-full gap-6 min-w-max">
            {['To Do', 'In Progress', 'Completed'].map(status => {
              const statusTasks = filteredTasks.filter(t => t.status === status);
              return (
                <div key={status} className="flex h-full w-80 flex-col rounded-2xl bg-surface/40 border border-gray-800 p-4 shadow-inner">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white tracking-wide">{status}</h3>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-gray-300">
                      {statusTasks.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {statusTasks.map(task => (
                      <div 
                        key={task._id} 
                        className="group relative rounded-xl border border-gray-700 bg-surface p-4 shadow-md transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBg(task.status)}`}>
                            {task.status}
                          </span>
                          <select
                            className="appearance-none bg-transparent text-gray-500 hover:text-white cursor-pointer outline-none text-xs"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            disabled={user?.role !== 'Admin' && task.assignedTo?._id !== user?.id}
                          >
                            <option value="To Do">Move to To Do</option>
                            <option value="In Progress">Move to In Progress</option>
                            <option value="Completed">Move to Completed</option>
                          </select>
                        </div>
                        
                        <h4 className="font-medium text-white mb-1 line-clamp-2 leading-tight">{task.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                        
                        <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-xs">
                          <div className="flex items-center text-gray-500">
                            <span className="truncate max-w-[100px]">{task.assignedTo?.name || 'Unassigned'}</span>
                          </div>
                          <div className={`flex items-center ${isOverdue(task.deadline, task.status) ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
                            <Clock size={12} className="mr-1" />
                            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-2xl border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Project</label>
                <select
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  required
                  rows="2"
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Deadline</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Assign To</label>
                <select
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select User</option>
                  {allUsers.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
