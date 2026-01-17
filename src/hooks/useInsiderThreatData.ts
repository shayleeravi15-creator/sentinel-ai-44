import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserActivity, ThreatAlert, MLModelMetrics, DashboardStats } from '@/types/insider-threat';

export function useUserActivities() {
  return useQuery({
    queryKey: ['user-activities'],
    queryFn: async (): Promise<UserActivity[]> => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('risk_score', { ascending: false });

      if (error) throw error;
      return data as UserActivity[];
    },
  });
}

export function useThreatAlerts() {
  return useQuery({
    queryKey: ['threat-alerts'],
    queryFn: async (): Promise<ThreatAlert[]> => {
      const { data, error } = await supabase
        .from('threat_alerts')
        .select(`
          *,
          user_activity:user_activities(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ThreatAlert[];
    },
  });
}

export function useMLModelMetrics() {
  return useQuery({
    queryKey: ['ml-model-metrics'],
    queryFn: async (): Promise<MLModelMetrics[]> => {
      const { data, error } = await supabase
        .from('ml_model_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MLModelMetrics[];
    },
  });
}

export function useDashboardStats(activities: UserActivity[] | undefined) {
  return {
    totalUsers: activities?.length || 0,
    normalUsers: activities?.filter(a => a.threat_level === 'normal' || a.threat_level === 'low').length || 0,
    suspiciousUsers: activities?.filter(a => a.threat_level === 'medium' || a.threat_level === 'high' || a.threat_level === 'critical').length || 0,
    criticalAlerts: activities?.filter(a => a.threat_level === 'critical').length || 0,
    averageRiskScore: activities?.length 
      ? parseFloat((activities.reduce((sum, a) => sum + a.risk_score, 0) / activities.length).toFixed(1))
      : 0,
    detectionAccuracy: 94.5,
  } as DashboardStats;
}
