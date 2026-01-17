export interface UserActivity {
  id: string;
  user_identifier: string;
  username: string;
  department: string;
  login_time: string;
  logout_time: string | null;
  access_frequency: number;
  files_accessed: number;
  failed_login_attempts: number;
  after_hours_access: boolean;
  unusual_data_transfer: boolean;
  sensitive_files_accessed: number;
  risk_score: number;
  threat_level: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  is_anomaly: boolean;
  created_at: string;
}

export interface ThreatAlert {
  id: string;
  user_activity_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  is_acknowledged: boolean;
  created_at: string;
  user_activity?: UserActivity;
}

export interface MLModelMetrics {
  id: string;
  model_type: string;
  accuracy: number;
  precision_score: number;
  recall_score: number;
  f1_score: number;
  false_positive_rate: number;
  training_date: string;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  normalUsers: number;
  suspiciousUsers: number;
  criticalAlerts: number;
  averageRiskScore: number;
  detectionAccuracy: number;
}
