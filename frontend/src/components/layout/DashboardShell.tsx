import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, type LucideIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { authApi } from '../../api/auth.api';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  navItems,
  children,
}: {
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore network errors on logout */
    }
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-base-950 bg-grid-fade">
      <aside className="flex w-64 shrink-0 flex-col border-r border-base-700/60 bg-base-900/60 px-4 py-6 backdrop-blur-sm">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="h-2 w-2 rounded-full bg-signal-cyan animate-pulseDot" />
          <span className="font-display text-lg font-semibold tracking-tight">HireLens</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-signal-cyan/10 text-signal-cyan'
                    : 'text-ink-300 hover:bg-base-800 hover:text-ink-100'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-base-700/60 pt-4">
          <p className="truncate px-2 text-sm font-medium text-ink-100">{user?.name}</p>
          <p className="truncate px-2 font-mono text-xs text-ink-500">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-300 transition-colors hover:bg-signal-rose/10 hover:text-signal-rose"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
