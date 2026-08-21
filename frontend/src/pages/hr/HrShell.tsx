import { LayoutDashboard, Users } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';

const NAV_ITEMS = [
  { to: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hr/candidates', label: 'Candidates', icon: Users },
];

export function HrShell({ children }: { children: React.ReactNode }) {
  return <DashboardShell navItems={NAV_ITEMS}>{children}</DashboardShell>;
}
