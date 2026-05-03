import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { ArrowLeft, Users, Calendar, Plus } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [allUsers, setAllUsers] = useState([]);
  
  // Task form
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [createError, setCreateError] = useState('');

  const fetchData = async () => {
    try {
      setFetchError('');
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      
      if (user?.role === 'Admin') {
        const usersRes = await api.get('/users');
        setAllUsers(usersRes.data.data);
      }
    } catch (err) {
      setFetchError(getErrorMessage(err));
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      await api.post(`/projects/${id}/tasks`, {
        title,
        description,
        deadline,
        assignedTo
      });
      setShowTaskModal(false);
      setTitle('');
      setDescription('');
      setDeadline('');
      setAssignedTo('');
      fetchData(); // Refresh data
    } catch (err) {
      setCreateError(getErrorMessage(err));
    }
  };

  if (loading) return <div className="text-gray-400">Loading project details...</div>;
  if (fetchError) return <div className="text-red-400">{fetchError}</div>;
  if (!project) return <div className="text-red-400">Project not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Projects
      </Link>

      <div className="rounded-2xl border border-gray-800 bg-surface p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-gray-400 max-w-2xl">{project.description}</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex gap-6">
            <div className="flex items-center text-sm text-gray-300">
              <Calendar size={18} className="mr-2 text-primary" />
              <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Users size={18} className="mr-2 text-secondary" />
              <span>{project.members?.length} Members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Project Tasks</h2>
        {user?.role === 'Admin' && (
          <button
            onClick={() => {
              setCreateError('');
              setShowTaskModal(true);
            }}
            className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {['To Do', 'In Progress', 'Completed'].map((status) => (
          <div key={status} className="flex flex-col rounded-xl border border-gray-800 bg-background/50 p-4">
            <div className="mb-4 flex items-center justify-between px-1">
              <h3 className="font-medium text-gray-300">{status}</h3>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-semibold text-gray-400 border border-gray-700">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="rounded-lg border border-gray-700 bg-surface p-4 shadow-sm hover:border-primary/50 transition-colors">
                  <h4 className="font-semibold text-white">{task.title}</h4>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">{task.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>{task.assignedTo?.name}</span>
                    <span className={new Date(task.deadline) < new Date() && status !== 'Completed' ? 'text-red-400 font-medium' : ''}>
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Add New Task</h2>
            {createError ? (
              <div className="mb-4 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                {createError}
              </div>
            ) : null}
            <form onSubmit={handleCreateTask} className="space-y-4">
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
                  rows="3"
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
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setCreateError('');
                    setShowTaskModal(false);
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
