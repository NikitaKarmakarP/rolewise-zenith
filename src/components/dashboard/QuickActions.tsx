import { UserPlus, Calendar, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAddEmployee?: () => void;
  onApplyLeave?: () => void;
  onGenerateReport?: () => void;
  onSendNotification?: () => void;
}

const actions = [
  {
    label: 'Add Employee',
    icon: UserPlus,
    description: 'Onboard new team member',
    action: 'addEmployee',
  },
  {
    label: 'Apply Leave',
    icon: Calendar,
    description: 'Submit leave request',
    action: 'applyLeave',
  },
  {
    label: 'Generate Report',
    icon: FileText,
    description: 'Create custom report',
    action: 'generateReport',
  },
  {
    label: 'Send Notification',
    icon: Send,
    description: 'Broadcast to employees',
    action: 'sendNotification',
  },
];

export function QuickActions({
  onAddEmployee,
  onApplyLeave,
  onGenerateReport,
  onSendNotification,
}: QuickActionsProps) {
  const handleClick = (action: string) => {
    switch (action) {
      case 'addEmployee':
        onAddEmployee?.();
        break;
      case 'applyLeave':
        onApplyLeave?.();
        break;
      case 'generateReport':
        onGenerateReport?.();
        break;
      case 'sendNotification':
        onSendNotification?.();
        break;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="secondary"
              className="h-auto flex-col gap-2 p-4 hover:bg-accent/10 hover:border-accent/30"
              onClick={() => handleClick(action.action)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-card-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
