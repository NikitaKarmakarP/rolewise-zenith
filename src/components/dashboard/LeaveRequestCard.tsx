import { cn } from '@/lib/utils';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeaveRequest } from '@/types/hrms';
import { format, parseISO } from 'date-fns';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function LeaveRequestCard({
  request,
  showActions = false,
  onApprove,
  onReject,
}: LeaveRequestCardProps) {
  const statusStyles = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected',
  };

  const leaveTypeColors = {
    annual: 'bg-info/10 text-info',
    sick: 'bg-destructive/10 text-destructive',
    personal: 'bg-warning/10 text-warning',
    maternity: 'bg-success/10 text-success',
    paternity: 'bg-accent/10 text-accent',
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="card-hover rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {getInitials(request.userName)}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-card-foreground">{request.userName}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span>{request.numDays} day{request.numDays !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                  leaveTypeColors[request.leaveType]
                )}
              >
                {request.leaveType}
              </span>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                  statusStyles[request.status]
                )}
              >
                {request.status}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{request.reason}</p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Requested {format(parseISO(request.requestedAt), 'MMM d, yyyy \'at\' h:mm a')}</span>
          </div>

          {/* Actions */}
          {showActions && request.status === 'pending' && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove?.(request.id)}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(request.id)}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                Reject
              </Button>
            </div>
          )}

          {/* Manager Comment */}
          {request.managerComment && (
            <div className="mt-2 rounded-md bg-muted/50 p-2 text-sm">
              <span className="font-medium text-muted-foreground">Manager: </span>
              <span className="text-muted-foreground">{request.managerComment}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
