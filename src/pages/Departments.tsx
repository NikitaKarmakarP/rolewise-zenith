import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Plus, Users, UserCog, Search, Pencil, Trash2 } from 'lucide-react';
import { mockDepartments, mockUsers, currentUser } from '@/data/mockData';
import { toast } from 'sonner';
import type { Department } from '@/types/hrms';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  const managers = mockUsers.filter((u) => u.role === 'manager' || u.role === 'hr' || u.role === 'admin');

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDepartmentHead = (headId: string) => {
    const head = mockUsers.find((u) => u.id === headId);
    return head ? `${head.firstName} ${head.lastName}` : 'Unassigned';
  };

  const handleAddDepartment = () => {
    if (!newDeptName.trim()) {
      toast.error('Please enter a department name');
      return;
    }
    const newDept: Department = {
      id: `d${Date.now()}`,
      name: newDeptName,
      headId: newDeptHead || '',
      employeeCount: 0,
    };
    setDepartments([...departments, newDept]);
    setNewDeptName('');
    setNewDeptHead('');
    setIsAddOpen(false);
    toast.success('Department added successfully');
  };

  const handleEditDepartment = () => {
    if (!editingDept || !newDeptName.trim()) return;
    setDepartments(
      departments.map((d) =>
        d.id === editingDept.id
          ? { ...d, name: newDeptName, headId: newDeptHead || d.headId }
          : d
      )
    );
    setEditingDept(null);
    setNewDeptName('');
    setNewDeptHead('');
    toast.success('Department updated successfully');
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
    toast.success('Department deleted successfully');
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setNewDeptName(dept.name);
    setNewDeptHead(dept.headId);
  };

  return (
    <DashboardLayout user={currentUser} pageTitle="Departments"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Department Name</Label>
                  <Input
                    placeholder="e.g., Finance"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department Head</Label>
                  <Select value={newDeptHead} onValueChange={setNewDeptHead}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.firstName} {m.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddDepartment} className="w-full">
                  Add Department
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Departments Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="group relative overflow-hidden">
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(dept)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteDepartment(dept.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCog className="h-4 w-4" />
                  <span>Head: {getDepartmentHead(dept.headId)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{dept.employeeCount} employees</span>
                  </div>
                  <Badge variant="secondary">{dept.employeeCount} members</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No departments found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or add a new department
            </p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingDept} onOpenChange={() => setEditingDept(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Department Name</Label>
                <Input
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Department Head</Label>
                <Select value={newDeptHead} onValueChange={setNewDeptHead}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEditDepartment} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
