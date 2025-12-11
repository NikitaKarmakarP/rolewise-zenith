import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Building2,
  UserCog,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/types/hrms';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  userPosition: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['admin', 'hr', 'manager', 'employee'] },
  { label: 'Employees', icon: Users, href: '/employees', roles: ['admin', 'hr', 'manager'] },
  { label: 'Leave Management', icon: Calendar, href: '/leaves', roles: ['admin', 'hr', 'manager', 'employee'] },
  { label: 'Departments', icon: Building2, href: '/departments', roles: ['admin', 'hr'] },
  { label: 'Reports', icon: BarChart3, href: '/reports', roles: ['admin', 'hr', 'manager'] },
  { label: 'Payroll', icon: FileText, href: '/payroll', roles: ['admin', 'hr'] },
  { label: 'User Management', icon: UserCog, href: '/users', roles: ['admin'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['admin', 'hr', 'manager', 'employee'] },
];

export function Sidebar({ userRole, userName, userPosition }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-sidebar-foreground">
                HRMS
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            className={cn(
              'mb-2 w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <Bell className="h-5 w-5" />
            {!isCollapsed && (
              <>
                <span>Notifications</span>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                  3
                </span>
              </>
            )}
          </Button>

          {/* User Profile */}
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3',
              isCollapsed && 'justify-center p-2'
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              {getInitials(userName)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {userName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {userPosition}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            className={cn(
              'mt-2 w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
