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
  id: number;
  handle: string;
  problemName: string;
  problemIndex: string;
  difficulty?: number;
  verdict: string;
  customMessage: string;
  timestamp: string;
}

const verdictOptions = [
  { value: 'WRONG_ANSWER', label: 'Wrong Answer' },
  { value: 'TIME_LIMIT_EXCEEDED', label: 'Time Limit Exceeded' },
  { value: 'MEMORY_LIMIT_EXCEEDED', label: 'Memory Limit Exceeded' },
  { value: 'RUNTIME_ERROR', label: 'Runtime Error' },
  { value: 'COMPILATION_ERROR', label: 'Compilation Error' },
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
      const response = await axios.get(`${API_BASE_URL}/mistakes/verdict/${selectedVerdict}`);
      const data = response.data.map((item: any, idx: number) => ({
        id: item.id || idx,
        handle: item.handle,
        problemName: item.problem_name,
        problemIndex: item.problem_index || '-',
        difficulty: item.difficulty,
        verdict: item.verdict,
        customMessage: item.message,
        timestamp: item.timestamp || new Date().toISOString(),
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
            <Filter className="h-5 w-5" />
            <span>Mistakes by Verdict</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="verdict">Verdict Type</Label>
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
                    <TableHead>Verdict</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mistakes.map((mistake) => (
                    <TableRow key={mistake.id}>
                      <TableCell className="font-medium">
                        {mistake.handle}
                      </TableCell>
                      <TableCell>
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

export default MistakesByVerdict;