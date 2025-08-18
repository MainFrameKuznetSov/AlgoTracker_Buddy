import React, { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import axios from 'axios';

interface Submission {
  id: number;
  problem: {
    name: string;
    index: string;
    rating?: number;
    tags: string[];
  };
  verdict: string;
  passedTestCount: number;
  testCount: number;
}

interface AddMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  handle: string;
}

const AddMessageModal = ({ isOpen, onClose, submission, handle }: AddMessageModalProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a custom message for this mistake.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const mistakeData = {
        handle,
        problem_name: submission.problem.name,
        problem_index: submission.problem.index,
        difficulty: submission.problem.rating,
        tags: submission.problem.tags,
        verdict: submission.verdict,
        passedtestcount: submission.passedTestCount,
        totaltestcount: submission.testCount,
        message: message,
        submission_id: submission.id,
        timestamp: new Date().toISOString(),
      };
      await axios.post(`${API_BASE_URL}/mistakes`, mistakeData);
      toast({
        title: "Mistake saved!",
        description: "Your custom message has been saved successfully.",
      });
      onClose();
      setMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to save the mistake. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Message</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg space-y-2">
            <div className="font-medium">
              {submission.problem.index}. {submission.problem.name}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">
                {submission.verdict.replace(/_/g, ' ')}
              </Badge>
              {submission.problem.rating && (
                <Badge variant="outline">{submission.problem.rating}</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {submission.passedTestCount}/{submission.testCount || '?'} tests
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Notes</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What went wrong? What did you learn? Any insights for next time..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Save className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Mistake
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMessageModal;