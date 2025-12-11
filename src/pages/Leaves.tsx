import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeaveRequestCard } from '@/components/dashboard/LeaveRequestCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import { currentUser, mockLeaveRequests, mockLeaveBalances } from '@/data/mockData';
import { toast } from 'sonner';
import type { LeaveStatus } from '@/types/hrms';

export default function Leaves() {
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState(mockLeaveRequests);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'approved' as LeaveStatus, managerComment: 'Request approved.' }
          : r
      )
    );
    toast.success('Leave request approved successfully');
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'rejected' as LeaveStatus, managerComment: 'Request declined.' }
          : r
      )
    );
    toast.error('Leave request rejected');
  };

  // Get current user's leave balances
  const userBalances = mockLeaveBalances.filter((b) => b.userId === '4'); // Demo user

  return (
    <DashboardLayout user={currentUser} pageTitle="Leave Management">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={requests.length}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Approved"
            value={approvedCount}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Rejected"
            value={rejectedCount}
            icon={XCircle}
            variant="default"
          />
        </div>

        {/* Leave Balance Cards (for employee view) */}
        {currentUser.role === 'employee' && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Your Leave Balance
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {userBalances.map((balance) => (
                <div
                  key={`${balance.userId}-${balance.leaveType}`}
                  className="rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <p className="text-sm font-medium capitalize text-muted-foreground">
                    {balance.leaveType} Leave
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="font-display text-3xl font-bold text-foreground">
                      {balance.balance}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      of {balance.total} days
                    </p>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{
                        width: `${(balance.balance / balance.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs & Filters */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>
              <Button variant="accent">
                <Plus className="mr-2 h-4 w-4" />
                Apply Leave
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-3">
            {filteredRequests.map((request) => (
              <LeaveRequestCard
                key={request.id}
                request={request}
                showActions={currentUser.role === 'hr' || currentUser.role === 'manager'}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {filteredRequests
              .filter((r) => r.status === 'pending')
              .map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  showActions={currentUser.role === 'hr' || currentUser.role === 'manager'}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3">
            {filteredRequests
              .filter((r) => r.status === 'approved')
              .map((request) => (
                <LeaveRequestCard key={request.id} request={request} />
              ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3">
            {filteredRequests
              .filter((r) => r.status === 'rejected')
              .map((request) => (
                <LeaveRequestCard key={request.id} request={request} />
              ))}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No leave requests</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No requests match your current filters
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
