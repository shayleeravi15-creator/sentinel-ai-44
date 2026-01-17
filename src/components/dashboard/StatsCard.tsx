import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  trend?: { value: number; label: string };
}

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default', trend }: StatsCardProps) {
  const variantStyles = {
    default: 'border-border cyber-glow',
    success: 'border-cyber-green/30 safe-glow',
    warning: 'border-cyber-amber/30 threat-glow-medium',
    danger: 'border-cyber-red/30 threat-glow-high',
  };

  const iconStyles = {
    default: 'text-primary bg-primary/10',
    success: 'text-cyber-green bg-cyber-green/10',
    warning: 'text-cyber-amber bg-cyber-amber/10',
    danger: 'text-cyber-red bg-cyber-red/10',
  };

  return (
    <div className={cn(
      'cyber-card border transition-all duration-300 hover:scale-[1.02]',
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold font-mono text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              trend.value >= 0 ? 'text-cyber-green' : 'text-cyber-red'
            )}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          iconStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
