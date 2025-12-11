export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  avatar?: string;
  managerId?: string;
  dateOfJoining: string;
  isActive: boolean;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numDays: number;
  reason: string;
  status: LeaveStatus;
  managerId?: string;
  managerComment?: string;
  requestedAt: string;
}

export interface LeaveBalance {
  userId: string;
  leaveType: LeaveType;
  balance: number;
  used: number;
  total: number;
}

export interface Department {
  id: string;
  name: string;
  headId: string;
  employeeCount: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  approvedLeavesToday: number;
  newHiresThisMonth: number;
  departmentCount: number;
}
