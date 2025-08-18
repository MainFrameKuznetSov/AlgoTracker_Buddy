import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Search } from 'lucide-react';

interface SavedMistake {
  id: number;
  problemName: string;
  problemIndex: string;
  difficulty?: number;
  verdict: string;
  customMessage: string;
  timestamp: string;
  passedTestCount: number;
  totalTestCount?: number;
}

const SavedMistakes = () => {
  const [handle, setHandle] = useState('');
  const [mistakes, setMistakes] = useState<SavedMistake[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSavedMistakes = async () => {
    if (!handle.trim()) {
      toast({
        title: "Handle required",
        description: "Please enter a handle to view saved mistakes.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/mistakes/${handle}`);
      // Map backend fields to frontend fields if needed
      const data = response.data.map((item: any, idx: number) => ({
        id: item.id || idx,
        problemName: item.problem_name,
        problemIndex: item.problem_index || '-',
        difficulty: item.difficulty,
        verdict: item.verdict,
        customMessage: item.message,
        timestamp: item.timestamp || new Date().toISOString(),
        passedTestCount: item.passedtestcount,
        totalTestCount: item.totaltestcount,
      }));
      setMistakes(data);
      toast({
        title: "Success",
        description: `Found ${data.length} saved mistakes for ${handle}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to fetch saved mistakes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <BookOpen className="h-5 w-5" />
            <span>Saved Mistakes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter handle to view saved mistakes"
                onKeyPress={(e) => e.key === 'Enter' && fetchSavedMistakes()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchSavedMistakes} disabled={isLoading}>
                {isLoading ? (
                  <Search className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Load Mistakes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Your Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mistakes.map((mistake) => (
                    <TableRow key={mistake.id}>
                      <TableCell className="font-medium">
                        {mistake.problemIndex}. {mistake.problemName}
                      </TableCell>
                      <TableCell>
                        {mistake.difficulty ? (
                          <Badge variant="outline">{mistake.difficulty}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getVerdictColor(mistake.verdict)}>
                          {mistake.verdict.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {mistake.passedTestCount}/{mistake.totalTestCount || '?'}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-muted-foreground truncate" title={mistake.customMessage}>
                          {mistake.customMessage}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(mistake.timestamp).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavedMistakes;