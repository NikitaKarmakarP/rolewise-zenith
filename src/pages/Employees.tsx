import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeCard } from '@/components/dashboard/EmployeeCard';
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
  Search,
  UserPlus,
  Grid3X3,
  List,
  Filter,
  Download,
} from 'lucide-react';
import { currentUser, mockUsers, mockDepartments, mockLeaveRequests, mockLeaveBalances } from '@/data/mockData';
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog';
import { EmployeeProfileDialog } from '@/components/dialogs/EmployeeProfileDialog';
import { ApplyLeaveDialog } from '@/components/dialogs/ApplyLeaveDialog';
import { toast } from 'sonner';
import type { User as UserType } from '@/types/hrms';

export default function Employees() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Dialog states
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<UserType | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);
  const [leaveEmployee, setLeaveEmployee] = useState<UserType | null>(null);

  const filteredEmployees = mockUsers.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === 'all' || employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const handleViewProfile = (employee: UserType) => {
    setSelectedEmployee(employee);
    setProfileDialogOpen(true);
  };

  const handleViewLeaveHistory = (employee: UserType) => {
    setSelectedEmployee(employee);
    setProfileDialogOpen(true);
  };

  const handleApplyLeave = (employee: UserType) => {
    setLeaveEmployee(employee);
    setApplyLeaveOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Department', 'Position', 'Role', 'Date of Joining'].join(','),
      ...filteredEmployees.map(emp => 
        [
          emp.id,
          `${emp.firstName} ${emp.lastName}`,
          emp.email,
          emp.department,
          emp.position,
          emp.role,
          emp.dateOfJoining
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Employee list exported successfully!');
  };

  const getEmployeeLeaveHistory = (employeeId: string) => {
    return mockLeaveRequests.filter(req => req.userId === employeeId);
  };

  const getEmployeeLeaveBalances = (employeeId: string) => {
    return mockLeaveBalances.filter(bal => bal.userId === employeeId);
  };

  return (
    <DashboardLayout user={currentUser} pageTitle="Employees">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {mockDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="accent" size="sm" onClick={() => setAddEmployeeOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredEmployees.length}</span> of{' '}
            <span className="font-medium text-foreground">{mockUsers.length}</span> employees
          </p>
        </div>

        {/* Employee Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EmployeeCard 
                  employee={employee} 
                  variant="grid" 
                  onViewProfile={() => handleViewProfile(employee)}
                  onViewLeaveHistory={() => handleViewLeaveHistory(employee)}
                  onApplyLeave={() => handleApplyLeave(employee)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <EmployeeCard 
                  employee={employee} 
                  variant="list" 
                  onViewProfile={() => handleViewProfile(employee)}
                  onViewLeaveHistory={() => handleViewLeaveHistory(employee)}
                  onApplyLeave={() => handleApplyLeave(employee)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
            <Search className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No employees found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddEmployeeDialog
        open={addEmployeeOpen}
        onOpenChange={setAddEmployeeOpen}
        departments={mockDepartments}
      />

      <EmployeeProfileDialog
        employee={selectedEmployee}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        leaveHistory={selectedEmployee ? getEmployeeLeaveHistory(selectedEmployee.id) : []}
        leaveBalances={selectedEmployee ? getEmployeeLeaveBalances(selectedEmployee.id) : []}
      />

      <ApplyLeaveDialog
        open={applyLeaveOpen}
        onOpenChange={setApplyLeaveOpen}
      />
    </DashboardLayout>
  );
}