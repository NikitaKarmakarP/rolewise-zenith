import { cn } from '@/lib/utils';
import { Mail, MapPin, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/hrms';
import { format, parseISO } from 'date-fns';

interface EmployeeCardProps {
  employee: User;
  variant?: 'grid' | 'list';
  onViewProfile?: (employee: User) => void;
  onViewLeaveHistory?: (employee: User) => void;
}

export function EmployeeCard({ employee, variant = 'grid', onViewProfile, onViewLeaveHistory }: EmployeeCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'hr':
        return 'bg-info/10 text-info border-info/20';
      case 'manager':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  if (variant === 'list') {
    return (
      <div className="card-hover flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground">
          {getInitials(employee.firstName, employee.lastName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-card-foreground truncate">
              {employee.firstName} {employee.lastName}
            </h4>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                getRoleBadgeColor(employee.role)
              )}
            >
              {employee.role}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{employee.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            <span className="truncate max-w-[180px]">{employee.email}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewProfile?.(employee)}>View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewProfile?.(employee)}>Edit Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewLeaveHistory?.(employee)}>View Leave History</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="card-hover rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground">
            {getInitials(employee.firstName, employee.lastName)}
          </div>
          <div>
            <h4 className="font-medium text-card-foreground">
              {employee.firstName} {employee.lastName}
            </h4>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
            getRoleBadgeColor(employee.role)
          )}
        >
          {employee.role}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <span>{employee.department}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-accent" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <span>Joined {format(parseISO(employee.dateOfJoining), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => onViewProfile?.(employee)}>
          View Profile
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewProfile?.(employee)}>Edit Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewLeaveHistory?.(employee)}>View Leave History</DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
