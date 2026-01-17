import { cn } from '@/lib/utils';

interface ThreatLevelBadgeProps {
  level: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md';
}

export function ThreatLevelBadge({ level, size = 'md' }: ThreatLevelBadgeProps) {
  const styles = {
    normal: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
    low: 'bg-cyber-green/15 text-cyber-green border-cyber-green/25',
    medium: 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30',
    high: 'bg-cyber-red/20 text-cyber-red border-cyber-red/30',
    critical: 'bg-cyber-red/30 text-cyber-red border-cyber-red/50 animate-pulse',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium font-mono uppercase tracking-wider',
      styles[level],
      sizeStyles[size]
    )}>
      {level}
    </span>
  );
}
