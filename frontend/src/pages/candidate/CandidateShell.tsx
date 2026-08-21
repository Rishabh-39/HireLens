import { LayoutDashboard, User, FileUp, Radar, MessagesSquare, Mail } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/resume', label: 'Resume', icon: FileUp },
  { to: '/dashboard/feed', label: 'Career feed', icon: Radar },
  { to: '/dashboard/feedback', label: 'My feedback', icon: MessagesSquare },
  { to: '/dashboard/messages', label: 'HR messages', icon: Mail },
];

export function CandidateShell({ children }: { children: React.ReactNode }) {
  return <DashboardShell navItems={NAV_ITEMS}>{children}</DashboardShell>;
}
