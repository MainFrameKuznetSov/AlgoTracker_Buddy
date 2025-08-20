import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Filter, Search } from 'lucide-react';

interface FilteredMistake {
  id: number;
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
];

const FilteredMistakes = () => {
  const [handle, setHandle] = useState('');
  const [filterType, setFilterType] = useState<'verdict' | 'problem'>('verdict');
  const [selectedVerdict, setSelectedVerdict] = useState('');
  const [problemName, setProblemName] = useState('');
  const [mistakes, setMistakes] = useState<FilteredMistake[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFilteredMistakes = async () => {
    if (!handle.trim()) {
      toast({
        title: "Handle required",
        description: "Please enter a handle to filter mistakes for.",
        variant: "destructive",
      });
      return;
    }

    if (filterType === 'verdict' && !selectedVerdict) {
      toast({
        title: "Verdict required",
        description: "Please select a verdict to filter by.",
        variant: "destructive",
      });
      return;
    }

    if (filterType === 'problem' && !problemName.trim()) {
      toast({
        title: "Problem name required",
        description: "Please enter a problem name to filter by.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would call your backend API:
      // GET /mistakes/mistakes/{handle}/verdict/{verdict} or
      // GET /mistakes/mistakes/{handle}/problem/{problem_name}
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleMistakes: FilteredMistake[] = [
        {
          id: 1,
          handle: handle,
          problemName: filterType === 'problem' ? problemName : "Dynamic Programming",
          difficulty: 1400,
          verdict: filterType === 'verdict' ? selectedVerdict : "WRONG_ANSWER",
          customMessage: "Need to practice more DP state transitions. Made error in recurrence relation.",
          passedTestCount: 8,
        },
        {
          id: 2,
          handle: handle,
          problemName: filterType === 'problem' ? problemName : "Graph Theory",
          difficulty: 1600,
          verdict: filterType === 'verdict' ? selectedVerdict : "TIME_LIMIT_EXCEEDED",
          customMessage: "Used DFS instead of BFS. Algorithm choice was suboptimal for this problem type.",
          passedTestCount: 12,
        },
      ];
      
      setMistakes(sampleMistakes);
      toast({
        title: "Success",
        description: `Found ${sampleMistakes.length} filtered mistakes for ${handle}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch filtered mistakes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

    const getVerdictColor = (verdict: string) => {
    switch (verdict) 
    {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter handle"
              />
            </div>
            <div>
              <Label htmlFor="filterType">Filter By</Label>
              <Select value={filterType} onValueChange={(value: 'verdict' | 'problem') => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verdict">Verdict</SelectItem>
                  <SelectItem value="problem">Problem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filterType === 'verdict' ? (
            <div>
              <Label htmlFor="verdict">Verdict</Label>
              <Select value={selectedVerdict} onValueChange={setSelectedVerdict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verdict" />
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
          ) : (
            <div>
              <Label htmlFor="problem">Problem Name</Label>
              <Input
                id="problem"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                placeholder="Enter problem name"
              />
            </div>
          )}

          <Button onClick={fetchFilteredMistakes} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <Search className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Apply Filter
          </Button>
        </CardContent>
      </Card>

      {mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Filtered Results for {handle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Passed Tests</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mistakes.map((mistake) => (
                    <TableRow key={mistake.id}>
                      <TableCell className="font-medium">
                        {mistake.problemName}
                      </TableCell>
                      <TableCell>
                        {mistake.difficulty ? (
                          <Badge variant="outline">{mistake.difficulty}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                            variant="secondary" 
                            className={getVerdictColor(mistake.verdict)}
                          >
                          {mistake.verdict.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {mistake.passedTestCount}
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

export default FilteredMistakes;