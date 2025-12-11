import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeaveRequestCard } from '@/components/dashboard/LeaveRequestCard';
import { EmployeeCard } from '@/components/dashboard/EmployeeCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
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
} from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const pendingRequests = mockLeaveRequests.filter((r) => r.status === 'pending');
  const recentEmployees = mockUsers.slice(0, 4);

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
              <Button variant="hero-outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Reports
              </Button>
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
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
          />
          <StatCard
            title="Active Employees"
            value={mockDashboardStats.activeEmployees}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Pending Leaves"
            value={mockDashboardStats.pendingLeaves}
            icon={Calendar}
            variant="warning"
          />
          <StatCard
            title="Approved Today"
            value={mockDashboardStats.approvedLeavesToday}
            icon={TrendingUp}
            variant="accent"
          />
          <StatCard
            title="New Hires"
            value={mockDashboardStats.newHiresThisMonth}
            subtitle="This month"
            icon={UserPlus}
            variant="default"
          />
          <StatCard
            title="Departments"
            value={mockDashboardStats.departmentCount}
            icon={Building2}
            variant="primary"
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
              <Button variant="ghost" size="sm" className="text-accent">
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
            <QuickActions />
            <DepartmentChart departments={mockDepartments} />
          </div>
        </div>

        {/* Recent Employees */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Recent Employees
            </h3>
            <Button variant="ghost" size="sm" className="text-accent">
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
                <EmployeeCard employee={employee} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
