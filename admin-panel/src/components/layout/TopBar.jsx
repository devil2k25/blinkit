import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopBar({ onMenuClick }) {
  const { admin } = useAuth();
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2 w-64 hidden sm:flex">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {admin?.avatar || admin?.name?.[0] || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
