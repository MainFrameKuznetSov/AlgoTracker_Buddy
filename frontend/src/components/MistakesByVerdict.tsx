import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Filter, Search } from 'lucide-react';

interface MistakeByVerdict {
  handle: string;
  problemName: string;
  difficulty: number;
  verdict: string;
  customMessage: string;
  passedTestCount: number;
}

const verdictOptions = [
  { value: 'WRONG_ANSWER', label: 'Wrong Answer' },
  { value: 'TIME_LIMIT_EXCEEDED', label: 'Time Limit Exceeded' },
  { value: 'MEMORY_LIMIT_EXCEEDED', label: 'Memory Limit Exceeded' },
  { value: 'RUNTIME_ERROR', label: 'Runtime Error' },
  { value: 'COMPILATION_ERROR', label: 'Compilation Error' },
  { value: 'IDLENESS_LIMIT_EXCEEDED', label: 'Idleness Limit Exceeded'},
];

const MistakesByVerdict = () => {
  const [selectedVerdict, setSelectedVerdict] = useState('');
  const [mistakes, setMistakes] = useState<MistakeByVerdict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMistakesByVerdict = async () => {
    if (!selectedVerdict) {
      toast({
        title: "Verdict required",
        description: "Please select a verdict to filter by.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/mistakes/mistakes/verdict/${selectedVerdict}`);
      const data = response.data.map((item: any, idx: number) => ({
        handle: item.handle,
        problemName: item.problem_name,
        difficulty: item.difficulty || 800,
        verdict: item.verdict,
        customMessage: item.message,
        passedTestCount: item.passedtestcount,
      }));
      setMistakes(data);
      toast({
        title: "Success",
        description: `Found ${data.length} mistakes with verdict: ${selectedVerdict}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to fetch mistakes by verdict. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Mistakes by Verdict</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="verdict">Verdict</Label>
              <Select value={selectedVerdict} onValueChange={setSelectedVerdict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verdict to filter by" />
                </SelectTrigger>
                <SelectContent>
                  {verdictOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchMistakesByVerdict} disabled={isLoading}>
                {isLoading ? (
                  <Search className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Mistakes with verdict: {selectedVerdict.replace(/_/g, ' ')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Handle</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Passed Tests</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mistakes.map((mistake) => (
                    <TableRow>
                      <TableCell className="font-medium">
                        {mistake.handle}
                      </TableCell>
                      <TableCell>
                        {mistake.problemName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getDifficultyColour(mistake.difficulty)}
                          >
                          {mistake.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {mistake.passedTestCount}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={getVerdictColor(mistake.verdict)}
                          >
                          {mistake.verdict.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-muted-foreground truncate" title={mistake.customMessage}>
                          {mistake.customMessage}
                        </div>
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

export default MistakesByVerdict;