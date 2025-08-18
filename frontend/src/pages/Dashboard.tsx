import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Code, LogOut, User, Activity, Search, Filter, BarChart3 } from 'lucide-react';
import LiveMistakes from '@/components/LiveMistakes';
import SavedMistakes from '@/components/SavedMistakes';
import MistakesByVerdict from '@/components/MistakesByVerdict';
import MistakesByProblem from '@/components/MistakesByProblem';
import FilteredMistakes from '@/components/FilteredMistakes';
import RatingMistakes from '@/components/RatingMistakes';

type ActiveView = 'live' | 'saved' | 'verdict' | 'problem' | 'filtered' | 'rating';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('live');

  const sidebarItems = [
    { id: 'live' as ActiveView, label: 'Live Mistakes', icon: Activity, description: 'Fetch recent non-AC submissions' },
    { id: 'saved' as ActiveView, label: 'Saved Mistakes', icon: Search, description: 'View all saved mistakes' },
    { id: 'verdict' as ActiveView, label: 'By Verdict', icon: Filter, description: 'Filter by verdict type' },
    { id: 'problem' as ActiveView, label: 'By Problem', icon: BarChart3, description: 'Search by problem name' },
    { id: 'filtered' as ActiveView, label: 'Advanced Filter', icon: Filter, description: 'Handle + verdict/problem filters' },
    { id: 'rating' as ActiveView, label: 'Rating Range', icon: BarChart3, description: 'Filter by difficulty range' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'live':
        return <LiveMistakes />;
      case 'saved':
        return <SavedMistakes />;
      case 'verdict':
        return <MistakesByVerdict />;
      case 'problem':
        return <MistakesByProblem />;
      case 'filtered':
        return <FilteredMistakes />;
      case 'rating':
        return <RatingMistakes />;
      default:
        return <LiveMistakes />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground">AlgoTracker Buddy</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-card-foreground hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${
                        activeView === item.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 h-[calc(100vh-73px)] overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;