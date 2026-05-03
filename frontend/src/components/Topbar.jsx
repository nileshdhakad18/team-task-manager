import { useContext } from 'react';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-800 bg-background/80 px-8 backdrop-blur-md">
      {/* Global Search Placeholder */}
      <div className="flex w-full max-w-md items-center">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="w-full rounded-full border border-gray-700 bg-surface/50 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-700"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
