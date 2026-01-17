import { useState } from 'react';
import { UserActivity } from '@/types/insider-threat';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { RiskScoreGauge } from './RiskScoreGauge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Clock, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserActivityTableProps {
  activities: UserActivity[];
}

export function UserActivityTable({ activities }: UserActivityTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterThreat, setFilterThreat] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user_identifier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterThreat === 'all' || activity.threat_level === filterThreat;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="cyber-card border border-border space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          User Activity Monitor
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-secondary border-border w-full sm:w-64"
            />
          </div>
          <select
            value={filterThreat}
            onChange={(e) => setFilterThreat(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
          >
            <option value="all">All Threats</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Department</TableHead>
              <TableHead className="text-muted-foreground text-center">Risk Score</TableHead>
              <TableHead className="text-muted-foreground">Threat Level</TableHead>
              <TableHead className="text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-1">
                  <FileText className="h-4 w-4" />
                  Files
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Failed Logins
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last Login
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground text-center">Flags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity, index) => (
              <TableRow
                key={activity.id}
                className={cn(
                  'border-border transition-all duration-200',
                  activity.is_anomaly && 'bg-cyber-red/5',
                  index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{activity.username}</span>
                    <span className="text-xs text-muted-foreground font-mono">{activity.user_identifier}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{activity.department}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <RiskScoreGauge score={activity.risk_score} size="sm" />
                  </div>
                </TableCell>
                <TableCell>
                  <ThreatLevelBadge level={activity.threat_level} size="sm" />
                </TableCell>
                <TableCell className="text-center font-mono text-foreground">
                  {activity.files_accessed}
                  {activity.sensitive_files_accessed > 0 && (
                    <span className="text-cyber-amber ml-1">({activity.sensitive_files_accessed})</span>
                  )}
                </TableCell>
                <TableCell className={cn(
                  'text-center font-mono',
                  activity.failed_login_attempts > 2 ? 'text-cyber-red' : 'text-foreground'
                )}>
                  {activity.failed_login_attempts}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(activity.login_time)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {activity.after_hours_access && (
                      <span className="w-2 h-2 rounded-full bg-cyber-amber" title="After Hours Access" />
                    )}
                    {activity.unusual_data_transfer && (
                      <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" title="Unusual Data Transfer" />
                    )}
                    {activity.is_anomaly && (
                      <span className="w-2 h-2 rounded-full bg-cyber-purple" title="Anomaly Detected" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching your criteria
        </div>
      )}
    </div>
  );
}
