import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeaveRequestCard } from '@/components/dashboard/LeaveRequestCard';
import { EmployeeCard } from '@/components/dashboard/EmployeeCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { EmployeeProfileDialog } from '@/components/dialogs/EmployeeProfileDialog';
import { ApplyLeaveDialog } from '@/components/dialogs/ApplyLeaveDialog';
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog';
import { GenerateReportDialog } from '@/components/dialogs/GenerateReportDialog';
import { SendNotificationDialog } from '@/components/dialogs/SendNotificationDialog';
import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  UserPlus,
  Building2,
} from 'lucide-react';
import {
  currentUser,
  mockDashboardStats,
  mockLeaveRequests,
  mockUsers,
  mockDepartments,
  mockLeaveBalances,
} from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { User, LeaveRequest } from '@/types/hrms';

export default function Dashboard() {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);
  const [sendNotificationOpen, setSendNotificationOpen] = useState(false);

  const pendingRequests = leaveRequests.filter((r) => r.status === 'pending');
  const recentEmployees = mockUsers.slice(0, 4);

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: 'approved' as const, managerComment: 'Approved by manager' }
          : req
      )
    );
    toast.success('Leave request approved');
  };

  const handleReject = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: 'rejected' as const, managerComment: 'Rejected by manager' }
          : req
      )
    );
    toast.error('Leave request rejected');
  };

  const handleViewProfile = (employee: User) => {
    setSelectedEmployee(employee);
    setProfileDialogOpen(true);
  };

  const getEmployeeLeaveHistory = (employee: User) => {
    return mockLeaveRequests.filter((req) => req.userId === employee.id);
  };

  const getEmployeeLeaveBalances = (employee: User) => {
    return mockLeaveBalances.filter((bal) => bal.userId === employee.id);
  };

  return (
    <DashboardLayout user={currentUser} pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Welcome back, {currentUser.firstName}! 👋
              </h2>
              <p className="mt-1 text-primary-foreground/80">
                Here's what's happening with your team today.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <Button 
                variant="hero-outline" 
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate('/reports')}
              >
                View Reports
              </Button>
              <Button 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => setAddEmployeeOpen(true)}
              >
                Add Employee
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Total Employees"
            value={mockDashboardStats.totalEmployees}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
            onClick={() => navigate('/employees')}
          />
          <StatCard
            title="Active Employees"
            value={mockDashboardStats.activeEmployees}
            icon={UserCheck}
            variant="success"
            onClick={() => navigate('/employees')}
          />
          <StatCard
            title="Pending Leaves"
            value={mockDashboardStats.pendingLeaves}
            icon={Calendar}
            variant="warning"
            onClick={() => navigate('/leaves')}
          />
          <StatCard
            title="Approved Today"
            value={mockDashboardStats.approvedLeavesToday}
            icon={TrendingUp}
            variant="accent"
            onClick={() => navigate('/leaves')}
          />
          <StatCard
            title="New Hires"
            value={mockDashboardStats.newHiresThisMonth}
            subtitle="This month"
            icon={UserPlus}
            variant="default"
            onClick={() => navigate('/employees')}
          />
          <StatCard
            title="Departments"
            value={mockDashboardStats.departmentCount}
            icon={Building2}
            variant="primary"
            onClick={() => navigate('/departments')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Leave Requests */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Pending Leave Requests
              </h3>
              <Button variant="ghost" size="sm" className="text-accent" onClick={() => navigate('/leaves')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={request}
                    showActions={currentUser.role === 'hr' || currentUser.role === 'manager'}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No pending requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions
              onAddEmployee={() => setAddEmployeeOpen(true)}
              onApplyLeave={() => setApplyLeaveOpen(true)}
              onGenerateReport={() => setGenerateReportOpen(true)}
              onSendNotification={() => setSendNotificationOpen(true)}
            />
            <DepartmentChart departments={mockDepartments} />
          </div>
        </div>

        {/* Recent Employees */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Recent Employees
            </h3>
            <Button variant="ghost" size="sm" className="text-accent" onClick={() => navigate('/employees')}>
              View All
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EmployeeCard 
                  employee={employee} 
                  onViewProfile={handleViewProfile}
                  onViewLeaveHistory={handleViewProfile}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EmployeeProfileDialog
        employee={selectedEmployee}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        leaveHistory={selectedEmployee ? getEmployeeLeaveHistory(selectedEmployee) : []}
        leaveBalances={selectedEmployee ? getEmployeeLeaveBalances(selectedEmployee) : []}
      />
      <ApplyLeaveDialog open={applyLeaveOpen} onOpenChange={setApplyLeaveOpen} />
      <AddEmployeeDialog
        open={addEmployeeOpen}
        onOpenChange={setAddEmployeeOpen}
        departments={mockDepartments}
      />
      <GenerateReportDialog open={generateReportOpen} onOpenChange={setGenerateReportOpen} />
      <SendNotificationDialog open={sendNotificationOpen} onOpenChange={setSendNotificationOpen} />
    </DashboardLayout>
  );
}
