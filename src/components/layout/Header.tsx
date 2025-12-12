import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Settings, HelpCircle, LogOut, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationsDialog } from '@/components/dialogs/NotificationsDialog';
import type { User } from '@/types/hrms';
import { toast } from 'sonner';

interface HeaderProps {
  user: User;
  pageTitle: string;
}

export function Header({ user, pageTitle }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive';
      case 'hr':
        return 'bg-info/10 text-info';
      case 'manager':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      navigate(`/employees?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Page Title */}
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <span
                    className={`mt-1 inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <UserIcon className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Help center coming soon!')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NotificationsDialog open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  );
}
