import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MapPin, Calendar, Building2, User, FileText } from 'lucide-react';
import type { User as UserType, LeaveRequest, LeaveBalance } from '@/types/hrms';
import { format, parseISO } from 'date-fns';

interface EmployeeProfileDialogProps {
  employee: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveHistory?: LeaveRequest[];
  leaveBalances?: LeaveBalance[];
}

export function EmployeeProfileDialog({
  employee,
  open,
  onOpenChange,
  leaveHistory = [],
  leaveBalances = [],
}: EmployeeProfileDialogProps) {
  if (!employee) return null;

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

  const statusStyles = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Employee Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xl font-semibold text-primary-foreground">
              {getInitials(employee.firstName, employee.lastName)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {employee.firstName} {employee.lastName}
                </h3>
                <Badge className={getRoleBadgeColor(employee.role)}>
                  {employee.role}
                </Badge>
              </div>
              <p className="text-muted-foreground">{employee.position}</p>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="leaves">Leave History</TabsTrigger>
              <TabsTrigger value="balances">Leave Balances</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <Building2 className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <User className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Employee ID</p>
                    <p className="text-sm font-medium">EMP-{employee.id.padStart(4, '0')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Joining</p>
                    <p className="text-sm font-medium">
                      {format(parseISO(employee.dateOfJoining), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">New York, USA</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaves" className="pt-4">
              {leaveHistory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {leaveHistory.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium capitalize">{leave.leaveType} Leave</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(leave.startDate), 'MMM d')} -{' '}
                          {format(parseISO(leave.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{leave.numDays} days</span>
                        <Badge className={statusStyles[leave.status]}>{leave.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No leave history available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="balances" className="pt-4">
              {leaveBalances.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {leaveBalances.map((balance) => (
                    <div
                      key={balance.leaveType}
                      className="rounded-lg border border-border p-4 text-center"
                    >
                      <p className="text-sm text-muted-foreground capitalize">{balance.leaveType}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{balance.balance}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {balance.used} used / {balance.total} total
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No leave balance data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="default">Edit Profile</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
