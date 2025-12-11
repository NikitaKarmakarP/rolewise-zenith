import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  Download,
  Search,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { mockUsers, currentUser } from '@/data/mockData';
import { toast } from 'sonner';

interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'processed' | 'pending' | 'draft';
  month: string;
}

const mockPayrollData: PayrollEntry[] = mockUsers.map((user, index) => ({
  id: `pay-${user.id}`,
  employeeId: user.id,
  employeeName: `${user.firstName} ${user.lastName}`,
  department: user.department,
  basicSalary: 5000 + index * 500,
  allowances: 500 + index * 50,
  deductions: 300 + index * 30,
  netPay: 5000 + index * 500 + 500 + index * 50 - (300 + index * 30),
  status: index % 3 === 0 ? 'pending' : index % 3 === 1 ? 'draft' : 'processed',
  month: 'December 2024',
}));

const payrollSummary = {
  totalPayroll: mockPayrollData.reduce((sum, p) => sum + p.netPay, 0),
  totalEmployees: mockPayrollData.length,
  processed: mockPayrollData.filter((p) => p.status === 'processed').length,
  pending: mockPayrollData.filter((p) => p.status === 'pending').length,
};

export default function Payroll() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('dec-2024');
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

  const filteredPayroll = mockPayrollData.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: PayrollEntry['status']) => {
    switch (status) {
      case 'processed':
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Processed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
            <AlertCircle className="mr-1 h-3 w-3" />
            Draft
          </Badge>
        );
    }
  };

  const handleProcessPayroll = () => {
    toast.success('Payroll processing initiated for December 2024');
  };

  const handleExportPayslips = () => {
    toast.success('Payslips exported successfully');
  };

  return (
    <DashboardLayout user={currentUser} pageTitle="Payroll"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold">
                  ${payrollSummary.totalPayroll.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{payrollSummary.totalEmployees}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold">{payrollSummary.processed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{payrollSummary.pending}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Payroll for {selectedMonth === 'dec-2024' ? 'December 2024' : selectedMonth}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleExportPayslips}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Payslips
                </Button>
                <Button size="sm" onClick={handleProcessPayroll}>
                  Process Payroll
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processed">Processed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dec-2024">Dec 2024</SelectItem>
                      <SelectItem value="nov-2024">Nov 2024</SelectItem>
                      <SelectItem value="oct-2024">Oct 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {['all', 'processed', 'pending', 'draft'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead className="text-right">Basic</TableHead>
                          <TableHead className="text-right">Allowances</TableHead>
                          <TableHead className="text-right">Deductions</TableHead>
                          <TableHead className="text-right">Net Pay</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayroll
                          .filter((entry) => tab === 'all' || entry.status === tab)
                          .map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">
                                {entry.employeeName}
                              </TableCell>
                              <TableCell>{entry.department}</TableCell>
                              <TableCell className="text-right">
                                ${entry.basicSalary.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                +${entry.allowances.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right text-destructive">
                                -${entry.deductions.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ${entry.netPay.toLocaleString()}
                              </TableCell>
                              <TableCell>{getStatusBadge(entry.status)}</TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setSelectedEntry(entry)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Payslip Details</DialogTitle>
                                    </DialogHeader>
                                    {selectedEntry && (
                                      <div className="space-y-4 pt-4">
                                        <div className="rounded-lg border p-4">
                                          <h4 className="font-semibold">
                                            {selectedEntry.employeeName}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedEntry.department}
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span>Basic Salary</span>
                                            <span>
                                              ${selectedEntry.basicSalary.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-green-600">
                                            <span>Allowances</span>
                                            <span>
                                              +${selectedEntry.allowances.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-destructive">
                                            <span>Deductions</span>
                                            <span>
                                              -${selectedEntry.deductions.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="border-t pt-2">
                                            <div className="flex justify-between font-semibold">
                                              <span>Net Pay</span>
                                              <span>
                                                ${selectedEntry.netPay.toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <Button className="w-full gap-2">
                                          <Download className="h-4 w-4" />
                                          Download Payslip
                                        </Button>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
