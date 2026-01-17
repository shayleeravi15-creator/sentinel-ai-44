import { Shield, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function DashboardHeader({ onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 cyber-glow">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Insider Threat Detection
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ML-Powered Behavioral Analytics Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border">
          <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          <span className="text-sm text-muted-foreground">System Active</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-border hover:bg-secondary"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-border hover:bg-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </header>
  );
}
