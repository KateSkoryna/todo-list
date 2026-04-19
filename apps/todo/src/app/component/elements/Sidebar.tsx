import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  ListTodo,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/vital', labelKey: 'nav.vitalTasks', icon: Flame, end: false },
  { to: '/tasks', labelKey: 'nav.myTasks', icon: ListTodo, end: false },
  {
    to: '/statistics',
    labelKey: 'nav.statistics',
    icon: BarChart2,
    end: false,
  },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings, end: false },
  { to: '/help', labelKey: 'nav.help', icon: HelpCircle, end: false },
];

function Sidebar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-dark-bg flex flex-col h-full shrink-0 rounded-tr-lg">
      {/* User block */}
      <div className="flex flex-col items-center gap-2 px-6 py-8 border-b border-white/10">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-dark-bg font-bold text-lg">
          {initials}
        </div>
        <p className="text-white font-semibold text-sm text-center">
          {user?.displayName}
        </p>
        <p className="text-secondary-dark-bg text-xs text-center truncate w-full">
          {user?.email}
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-accent text-dark-bg font-semibold'
                  : 'text-white hover:bg-white/10'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-dark-bg' : 'text-triadic-orange'
                  }`}
                />
                {t(labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0 text-triadic-orange" />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
