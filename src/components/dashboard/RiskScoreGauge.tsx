import { cn } from '@/lib/utils';

interface RiskScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreGauge({ score, size = 'md' }: RiskScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s < 30) return 'text-cyber-green';
    if (s < 60) return 'text-cyber-amber';
    return 'text-cyber-red';
  };

  const getBackgroundColor = (s: number) => {
    if (s < 30) return 'bg-cyber-green';
    if (s < 60) return 'bg-cyber-amber';
    return 'bg-cyber-red';
  };

  const sizeStyles = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg',
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', sizeStyles[size])}>
      <svg className="absolute transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className={cn('transition-all duration-500', getColor(score))}
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className={cn('font-mono font-bold', getColor(score))}>
        {score.toFixed(0)}
      </span>
    </div>
  );
}
