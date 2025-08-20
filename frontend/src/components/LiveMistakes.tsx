import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Activity, Plus, Search } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import axios from 'axios';
import AddMessageModal from './AddMessageModal';

interface Submission {
  id: number;
  problem_name: string;
  difficulty: number;
  tags: string[];
  verdict: string;
  passedTestCount: number;
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
      const response = await axios.get(`${API_BASE_URL}/mistakes/mistakes/live/${handle}`);

      const formatted = response.data.map((item: any, idx: number) => ({
        id: idx,
        problem_name: item.problem_name,
        difficulty: item.difficulty || 800,
        tags: item.tags || [],
        verdict: item.verdict,
        passedTestCount: item.passedTestCount,
      }));

      setSubmissions(formatted);
      toast({
        title: "Success",
        description: `Found ${response.data.length} recent mistakes for ${handle}`,
      });
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
        return 'bg-red-500 text-white dark:bg-red-600';
      case 'TIME_LIMIT_EXCEEDED':
        return 'bg-blue-500 text-white dark:bg-blue-600';
      case 'COMPILATION_ERROR':
        return 'bg-yellow-400 text-black dark:bg-yellow-500';
      case 'IDLENESS_LIMIT_EXCEEDED':
        return 'bg-gray-500 text-white dark:bg-gray-600';
      case 'ACCEPTED':
        return 'bg-green-500 text-white dark:bg-green-600';
      default:
        return 'bg-slate-500 text-white dark:bg-slate-600';
    }
  };

  const getDifficultyColour = (difficulty: number) => {
    if (difficulty < 1200)
      return "bg-gray-500 text-white dark:bg-gray-600"; // grey
    if (difficulty >= 1200 && difficulty < 1400)
      return "bg-green-500 text-white dark:bg-green-600"; // green
    if (difficulty >= 1400 && difficulty < 1600)
      return "bg-cyan-500 text-white dark:bg-cyan-600"; // cyan
    if (difficulty >= 1600 && difficulty < 1900)
      return "bg-blue-800 text-white dark:bg-blue-900"; // deep blue
    if (difficulty >= 1900 && difficulty < 2200)
      return "bg-fuchsia-500 text-white dark:bg-fuchsia-600"; // magenta
    if (difficulty >= 2200 && difficulty < 2300)
      return "bg-yellow-200 text-black dark:bg-yellow-300"; // light yellow
    if (difficulty >= 2300 && difficulty < 2400)
      return "bg-yellow-600 text-black dark:bg-yellow-700"; // deep yellow
    if (difficulty >= 2400)
      return "bg-red-600 text-white dark:bg-red-700"; // red
    return "bg-slate-500 text-white dark:bg-slate-600"; // fallback
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
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

      {/* Results Table */}
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
                    <TableHead>Passed Tests</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.problem_name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getDifficultyColour(submission.difficulty)}
                        >
                          {submission.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {submission.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getVerdictColor(submission.verdict)}
                        >
                          {submission.verdict.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{submission.passedTestCount}</TableCell>
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

      {/* Add Note Modal */}
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
