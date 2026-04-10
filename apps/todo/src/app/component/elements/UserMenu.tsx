import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const UserMenu = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOnStatistics = pathname === '/statistics';
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-center w-9 h-9 rounded-full border-2 hover:bg-accent hover:border-accent hover:text-black ${
          open
            ? 'bg-accent border-accent text-black'
            : 'bg-dark-bg border-transparent text-white'
        }`}
        aria-label="User menu"
      >
        <User className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <span className="text-sm text-dark-bg font-medium truncate block">
              {user.displayName}
            </span>
          </div>
          <ul className="py-1 list-none">
            <li>
              <Link
                to={isOnStatistics ? '/' : '/statistics'}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-dark-bg hover:bg-accent hover:font-bold"
              >
                {isOnStatistics ? 'Tasks' : 'Statistics'}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-dark-bg hover:bg-accent hover:font-bold"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
