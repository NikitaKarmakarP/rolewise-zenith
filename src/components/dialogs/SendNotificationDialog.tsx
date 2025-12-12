import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendNotificationDialog({ open, onOpenChange }: SendNotificationDialogProps) {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipient || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Notification sent successfully!');
    setFormData({ recipient: '', subject: '', message: '' });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Send className="h-5 w-5 text-accent" />
            Send Notification
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipients</Label>
            <Select
              value={formData.recipient}
              onValueChange={(value) => setFormData({ ...formData, recipient: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="engineering">Engineering Department</SelectItem>
                <SelectItem value="marketing">Marketing Department</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="managers">All Managers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Notification subject..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your notification message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
