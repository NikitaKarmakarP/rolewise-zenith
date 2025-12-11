import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { User } from '@/types/hrms';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  pageTitle: string;
}

export function DashboardLayout({ children, user, pageTitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        userRole={user.role}
        userName={`${user.firstName} ${user.lastName}`}
        userPosition={user.position}
      />
      <div className={cn('pl-[260px] transition-all duration-300')}>
        <Header user={user} pageTitle={pageTitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
