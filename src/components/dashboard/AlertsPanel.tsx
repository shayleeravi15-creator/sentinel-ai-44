import { ThreatAlert } from '@/types/insider-threat';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { Bell, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface AlertsPanelProps {
  alerts: ThreatAlert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const queryClient = useQueryClient();

  const acknowledgeAlert = async (alertId: string) => {
    await supabase
      .from('threat_alerts')
      .update({ is_acknowledged: true })
      .eq('id', alertId);

    queryClient.invalidateQueries({ queryKey: ['threat-alerts'] });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.is_acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.is_acknowledged);

  return (
    <div className="cyber-card border border-border space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyber-amber" />
          Threat Alerts
        </h3>
        <span className="text-sm text-muted-foreground">
          {unacknowledgedAlerts.length} active
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {unacknowledgedAlerts.length === 0 && acknowledgedAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No alerts at this time
          </div>
        ) : (
          <>
            {unacknowledgedAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-300 animate-fade-in',
                  alert.severity === 'critical' && 'bg-cyber-red/10 border-cyber-red/30 threat-glow-high',
                  alert.severity === 'high' && 'bg-cyber-red/5 border-cyber-red/20',
                  alert.severity === 'medium' && 'bg-cyber-amber/10 border-cyber-amber/30',
                  alert.severity === 'low' && 'bg-secondary border-border'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <ThreatLevelBadge level={alert.severity} size="sm" />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(alert.created_at)}
                      </span>
                    </div>
                    <p className="font-medium text-foreground text-sm">{alert.alert_type}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    {alert.user_activity && (
                      <p className="text-xs text-primary font-mono">
                        User: {(alert.user_activity as any).username}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="shrink-0 border-border hover:bg-secondary"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {acknowledgedAlerts.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Acknowledged</p>
                {acknowledgedAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-secondary/50 border border-border mb-2 opacity-60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{alert.alert_type}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatTimeAgo(alert.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
