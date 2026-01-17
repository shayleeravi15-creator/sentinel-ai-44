import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Users, UserCheck, AlertTriangle, Gauge, ShieldAlert, Brain } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UserActivityTable } from '@/components/dashboard/UserActivityTable';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { BehaviorChart } from '@/components/dashboard/BehaviorChart';
import { ModelMetricsCard } from '@/components/dashboard/ModelMetricsCard';
import { useUserActivities, useThreatAlerts, useMLModelMetrics, useDashboardStats } from '@/hooks/useInsiderThreatData';
import { seedDatabase } from '@/lib/seed-data';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const queryClient = useQueryClient();
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useUserActivities();
  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = useThreatAlerts();
  const { data: modelMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = useMLModelMetrics();
  const stats = useDashboardStats(activities);

  useEffect(() => {
    seedDatabase();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([refetchActivities(), refetchAlerts(), refetchMetrics()]);
  };

  const isLoading = activitiesLoading || alertsLoading || metricsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle scanline effect */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-30" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <DashboardHeader onRefresh={handleRefresh} isLoading={isLoading} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-card border border-border" />
            ))
          ) : (
            <>
              <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                subtitle="Monitored accounts"
                icon={Users}
                variant="default"
              />
              <StatsCard
                title="Normal Users"
                value={stats.normalUsers}
                subtitle="No threats detected"
                icon={UserCheck}
                variant="success"
              />
              <StatsCard
                title="Suspicious"
                value={stats.suspiciousUsers}
                subtitle="Requires investigation"
                icon={ShieldAlert}
                variant="warning"
              />
              <StatsCard
                title="Critical Alerts"
                value={stats.criticalAlerts}
                subtitle="Immediate action needed"
                icon={AlertTriangle}
                variant="danger"
              />
              <StatsCard
                title="Avg Risk Score"
                value={stats.averageRiskScore}
                subtitle="Across all users"
                icon={Gauge}
                variant="default"
              />
              <StatsCard
                title="Detection Rate"
                value={`${stats.detectionAccuracy}%`}
                subtitle="Model accuracy"
                icon={Brain}
                variant="success"
                trend={{ value: 2.3, label: 'vs last month' }}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Charts */}
          <div className="xl:col-span-3">
            {isLoading ? (
              <Skeleton className="h-[600px] bg-card border border-border" />
            ) : (
              <BehaviorChart activities={activities || []} />
            )}
          </div>

          {/* Alerts Panel */}
          <div className="xl:col-span-1">
            {isLoading ? (
              <Skeleton className="h-[600px] bg-card border border-border" />
            ) : (
              <AlertsPanel alerts={alerts || []} />
            )}
          </div>
        </div>

        {/* Model Metrics */}
        <div className="mb-8">
          {isLoading ? (
            <Skeleton className="h-64 bg-card border border-border" />
          ) : (
            <ModelMetricsCard metrics={modelMetrics || []} />
          )}
        </div>

        {/* User Activity Table */}
        {isLoading ? (
          <Skeleton className="h-96 bg-card border border-border" />
        ) : (
          <UserActivityTable activities={activities || []} />
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Insider Threat Detection System • ML-Based Behavioral Analytics
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Combining Isolation Forest (Unsupervised) + Random Forest (Supervised) for Enhanced Detection
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
