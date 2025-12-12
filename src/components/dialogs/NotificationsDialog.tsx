import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Calendar, FileText, UserPlus, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'leave' | 'payroll' | 'employee' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'leave',
    title: 'New Leave Request',
    message: 'Emily Davis has requested 5 days of annual leave.',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'leave',
    title: 'Leave Request Pending',
    message: 'James Taylor has requested 1 day of personal leave.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'payroll',
    title: 'Payroll Processed',
    message: 'December 2024 payroll has been successfully processed.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'employee',
    title: 'New Employee Onboarded',
    message: 'Amanda Brown has been successfully onboarded.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'System Update',
    message: 'HRMS has been updated to version 2.5.0 with new features.',
    time: '1 week ago',
    read: true,
  },
];

export function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'leave':
        return Calendar;
      case 'payroll':
        return FileText;
      case 'employee':
        return UserPlus;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'leave':
        return 'text-warning bg-warning/10';
      case 'payroll':
        return 'text-success bg-success/10';
      case 'employee':
        return 'text-accent bg-accent/10';
      case 'system':
        return 'text-info bg-info/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between font-display">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {unreadCount} new
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {mockNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex gap-3 rounded-lg border border-border p-3 transition-colors',
                    !notification.read && 'bg-accent/5 border-accent/20'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      getIconColor(notification.type)
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{notification.title}</p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="ghost" size="sm">
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
