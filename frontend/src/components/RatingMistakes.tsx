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
import { BarChart3, Search } from 'lucide-react';

interface RatingMistake {
  id: number;
  problemName: string;
  problemIndex: string;
  difficulty: number;
  verdict: string;
  tags: string[];
  passedTestCount: number;
}

const RatingMistakes = () => {
  const [handle, setHandle] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [mistakes, setMistakes] = useState<RatingMistake[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRatingMistakes = async () => {
  if (!handle.trim()) {
    toast({
      title: "Handle required",
      description: "Please enter a Codeforces handle.",
      variant: "destructive",
    });
    return;
  }

  if (!minRating || !maxRating) {
    toast({
      title: "Rating range required",
      description: "Please enter both minimum and maximum rating values.",
      variant: "destructive",
    });
    return;
  }

  const min = parseInt(minRating);
  const max = parseInt(maxRating);

  if (isNaN(min) || isNaN(max) || min > max) {
    toast({
      title: "Invalid rating range",
      description: "Please enter valid rating values (min ≤ max).",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  try {
    // ✅ Send A and B as query params
    const response = await axios.get(
      `${API_BASE_URL}/mistakes/mistakes/live/${handle}/rating`,
      { params: { A: min, B: max } }
    );

    const data = response.data.map((item: any, idx: number) => ({
      id: item.id || idx,
      problemName: item.problem_name,
      problemIndex: item.problem_index || '-',
      difficulty: item.difficulty || 'null',
      verdict: item.verdict,
      tags: item.tags || [],
      passedTestCount: item.passedTestCount,
    }));

    setMistakes(data);

    toast({
      title: "Success",
      description: `Found ${data.length} mistakes in rating range ${min}-${max} for ${handle}`,
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.response?.data?.detail || "Failed to fetch mistakes by rating. Please try again.",
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


  const getDifficultyColor = (rating: number) => {
    if (rating < 1000) return 'bg-gray-500';
    if (rating < 1200) return 'bg-green-500';
    if (rating < 1400) return 'bg-cyan-500';
    if (rating < 1600) return 'bg-blue-500';
    if (rating < 1900) return 'bg-purple-500';
    if (rating < 2100) return 'bg-yellow-500';
    if (rating < 2400) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Mistakes by Rating Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="handle">Codeforces Handle</Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter handle"
              />
            </div>
            <div>
              <Label htmlFor="minRating">Min Rating (A)</Label>
              <Input
                id="minRating"
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                placeholder="e.g., 1200"
              />
            </div>
            <div>
              <Label htmlFor="maxRating">Max Rating (B)</Label>
              <Input
                id="maxRating"
                type="number"
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
                placeholder="e.g., 1600"
              />
            </div>
          </div>

          <Button onClick={fetchRatingMistakes} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <Search className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search Rating Range
          </Button>
        </CardContent>
      </Card>

      {mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Mistakes in rating range {minRating}-{maxRating} for {handle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Tests</TableHead>
                    {/* <TableHead>Date</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mistakes.map((mistake) => (
                    <TableRow key={mistake.id}>
                      <TableCell className="font-medium">
                        {mistake.problemName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getDifficultyColor(mistake.difficulty)}`}
                            title={`Difficulty: ${mistake.difficulty}`}
                          />
                          <Badge variant="outline">{mistake.difficulty}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mistake.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
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
                      {/* <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(mistake.timestamp).toLocaleDateString()}
                        </span>
                      </TableCell> */}
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

export default RatingMistakes;