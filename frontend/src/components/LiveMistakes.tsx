import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Activity, Plus, Search } from 'lucide-react';
import axios from 'axios';
import AddMessageModal from './AddMessageModal';

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

const LiveMistakes = () => {
  const [handle, setHandle] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showAddMessage, setShowAddMessage] = useState(false);
  const { toast } = useToast();

  const fetchLiveMistakes = async () => {
    if (!handle.trim()) {
      toast({
        title: "Handle required",
        description: "Please enter a Codeforces handle.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would call your backend API
      // For demo, we'll simulate with Codeforces API
      const response = await axios.get(
        `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`
      );
      
      if (response.data.status === 'OK') {
        // Filter non-AC submissions
        const mistakes = response.data.result.filter(
          (sub: any) => sub.verdict !== 'OK'
        ).slice(0, 20); // Limit to 20 for demo
        
        setSubmissions(mistakes);
        toast({
          title: "Success",
          description: `Found ${mistakes.length} recent mistakes for ${handle}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions. Please check the handle and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowAddMessage(true);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'WRONG_ANSWER':
        return 'destructive';
      case 'TIME_LIMIT_EXCEEDED':
        return 'destructive';
      case 'MEMORY_LIMIT_EXCEEDED':
        return 'destructive';
      case 'RUNTIME_ERROR':
        return 'destructive';
      case 'COMPILATION_ERROR':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live Mistakes Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="handle">Codeforces Handle</Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter Codeforces handle"
                onKeyPress={(e) => e.key === 'Enter' && fetchLiveMistakes()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchLiveMistakes} disabled={isLoading}>
                {isLoading ? (
                  <Search className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Fetch Mistakes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Non-AC Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.problem.index}. {submission.problem.name}
                      </TableCell>
                      <TableCell>
                        {submission.problem.rating ? (
                          <Badge variant="outline">{submission.problem.rating}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {submission.problem.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {submission.problem.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{submission.problem.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getVerdictColor(submission.verdict)}>
                          {submission.verdict.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.passedTestCount}/{submission.testCount || '?'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddMessage(submission)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Note
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {showAddMessage && selectedSubmission && (
        <AddMessageModal
          isOpen={showAddMessage}
          onClose={() => {
            setShowAddMessage(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
          handle={handle}
        />
      )}
    </div>
  );
};

export default LiveMistakes;