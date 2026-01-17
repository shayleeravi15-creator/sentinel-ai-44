import { MLModelMetrics } from '@/types/insider-threat';
import { Brain, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelMetricsCardProps {
  metrics: MLModelMetrics[];
}

export function ModelMetricsCard({ metrics }: ModelMetricsCardProps) {
  if (metrics.length === 0) return null;

  const formatPercent = (value: number) => (value * 100).toFixed(2) + '%';

  const getMetricColor = (value: number, isInverse: boolean = false) => {
    const threshold = isInverse ? 0.1 : 0.8;
    if (isInverse) {
      return value < 0.05 ? 'text-cyber-green' : value < 0.1 ? 'text-cyber-amber' : 'text-cyber-red';
    }
    return value > 0.9 ? 'text-cyber-green' : value > 0.8 ? 'text-cyber-amber' : 'text-cyber-red';
  };

  return (
    <div className="cyber-card border border-border space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">ML Model Performance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={cn(
              'p-5 rounded-lg border transition-all duration-300',
              metric.model_type === 'Isolation Forest' 
                ? 'bg-cyber-cyan/5 border-cyber-cyan/20 cyber-glow' 
                : 'bg-cyber-green/5 border-cyber-green/20 safe-glow'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">{metric.model_type}</h4>
              <span className={cn(
                'text-xs px-2 py-1 rounded-full',
                metric.model_type === 'Isolation Forest' 
                  ? 'bg-cyber-cyan/20 text-primary' 
                  : 'bg-cyber-green/20 text-cyber-green'
              )}>
                {metric.model_type === 'Isolation Forest' ? 'Unsupervised' : 'Supervised'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
                <p className={cn('font-mono font-bold text-lg', getMetricColor(metric.accuracy))}>
                  {formatPercent(metric.accuracy)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Precision</span>
                </div>
                <p className={cn('font-mono font-bold text-lg', getMetricColor(metric.precision_score))}>
                  {formatPercent(metric.precision_score)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Recall</span>
                </div>
                <p className={cn('font-mono font-bold text-lg', getMetricColor(metric.recall_score))}>
                  {formatPercent(metric.recall_score)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">FP Rate</span>
                </div>
                <p className={cn('font-mono font-bold text-lg', getMetricColor(metric.false_positive_rate, true))}>
                  {formatPercent(metric.false_positive_rate)}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>F1 Score</span>
                <span className={cn('font-mono font-medium', getMetricColor(metric.f1_score))}>
                  {formatPercent(metric.f1_score)}
                </span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    metric.model_type === 'Isolation Forest' ? 'bg-primary' : 'bg-cyber-green'
                  )}
                  style={{ width: `${metric.f1_score * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
