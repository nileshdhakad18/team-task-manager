import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-800 bg-surface shadow-2xl relative z-40">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <CheckSquare size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Task<span className="font-light text-primary">Flow</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Overview
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-transparent text-white'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}
                  <span className={`mr-3 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-gray-300'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={logout}
          className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} className="mr-3 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
