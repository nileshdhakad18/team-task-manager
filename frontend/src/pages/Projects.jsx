import { useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../api/client';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Plus, FolderKanban, Calendar, Users } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Users state
  const [allUsers, setAllUsers] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [createError, setCreateError] = useState('');

  const fetchProjects = async () => {
    try {
      setFetchError('');
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      setFetchError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') {
      api.get('/users').then(res => setAllUsers(res.data.data)).catch(() => {});
    }
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      await api.post('/projects', { name, description, deadline, members: selectedMembers });
      setShowModal(false);
      setName('');
      setDescription('');
      setDeadline('');
      setSelectedMembers([]);
      fetchProjects();
    } catch (err) {
      setCreateError(getErrorMessage(err));
    }
  };

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  return (
    <div className="space-y-6">
      {fetchError ? (
        <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">{fetchError}</div>
      ) : null}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Projects</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your team's projects and collaborate efficiently.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => {
              setCreateError('');
              setShowModal(true);
            }}
            className="flex items-center rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
          >
            <Plus size={18} className="mr-2" />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-surface/30">
            <FolderKanban size={48} className="mb-4 text-gray-600" />
            <h3 className="text-lg font-medium text-white">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          </div>
        ) : (
          projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-transform duration-500 group-hover:scale-150" />
              
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner transition-colors group-hover:from-primary group-hover:to-secondary group-hover:text-white">
                  <FolderKanban size={24} />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-white truncate transition-colors group-hover:text-primary">{project.name}</h3>
              </div>
              <p className="mb-6 text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>
              
              <div className="flex items-center justify-between border-t border-gray-800 pt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>{new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center bg-gray-800/50 px-2 py-1 rounded-md">
                  <Users size={14} className="mr-1.5 text-gray-400" />
                  <span className="font-medium text-gray-300">{project.members?.length || 0}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-2xl border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            {createError ? (
              <div className="mb-4 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                {createError}
              </div>
            ) : null}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Assign Members</label>
                <div className="max-h-32 overflow-y-auto space-y-2 border border-gray-700 rounded-lg p-2 bg-background">
                  {allUsers.map((u) => (
                    <label key={u._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-surface text-primary focus:ring-primary"
                        checked={selectedMembers.includes(u._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, u._id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== u._id));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-300">{u.name} ({u.role})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setCreateError('');
                    setShowModal(false);
                  }}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
