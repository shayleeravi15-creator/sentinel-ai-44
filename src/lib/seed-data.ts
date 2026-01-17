import { supabase } from "@/integrations/supabase/client";

const departments = ['Engineering', 'Finance', 'HR', 'Sales', 'IT Security', 'Research', 'Operations'];
const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'William', 'Amanda', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUserIdentifier(): string {
  return `USR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generateUserActivity(isAnomalous: boolean = false) {
  const now = new Date();
  const loginTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  const logoutTime = Math.random() > 0.2 ? new Date(loginTime.getTime() + Math.random() * 8 * 60 * 60 * 1000) : null;
  
  // Anomalous behavior patterns
  const accessFrequency = isAnomalous ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 15) + 1;
  const filesAccessed = isAnomalous ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 20) + 1;
  const failedLoginAttempts = isAnomalous ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 2);
  const afterHoursAccess = isAnomalous ? Math.random() > 0.3 : Math.random() > 0.9;
  const unusualDataTransfer = isAnomalous ? Math.random() > 0.4 : Math.random() > 0.95;
  const sensitiveFilesAccessed = isAnomalous ? Math.floor(Math.random() * 30) + 5 : Math.floor(Math.random() * 3);
  
  // Calculate risk score based on behavior
  let riskScore = 0;
  riskScore += accessFrequency > 20 ? 20 : accessFrequency;
  riskScore += filesAccessed > 50 ? 30 : filesAccessed * 0.6;
  riskScore += failedLoginAttempts * 10;
  riskScore += afterHoursAccess ? 15 : 0;
  riskScore += unusualDataTransfer ? 25 : 0;
  riskScore += sensitiveFilesAccessed * 3;
  riskScore = Math.min(100, Math.max(0, riskScore));
  
  // Determine threat level
  let threatLevel: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  if (riskScore < 20) threatLevel = 'normal';
  else if (riskScore < 40) threatLevel = 'low';
  else if (riskScore < 60) threatLevel = 'medium';
  else if (riskScore < 80) threatLevel = 'high';
  else threatLevel = 'critical';

  return {
    user_identifier: generateUserIdentifier(),
    username: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
    department: getRandomElement(departments),
    login_time: loginTime.toISOString(),
    logout_time: logoutTime?.toISOString() || null,
    access_frequency: accessFrequency,
    files_accessed: filesAccessed,
    failed_login_attempts: failedLoginAttempts,
    after_hours_access: afterHoursAccess,
    unusual_data_transfer: unusualDataTransfer,
    sensitive_files_accessed: sensitiveFilesAccessed,
    risk_score: parseFloat(riskScore.toFixed(2)),
    threat_level: threatLevel,
    is_anomaly: isAnomalous,
  };
}

function generateAlert(activityId: string, threatLevel: string) {
  const alertTypes = {
    high: ['Unusual Data Access', 'Privilege Escalation Attempt', 'Mass File Download'],
    critical: ['Data Exfiltration Detected', 'Credential Compromise', 'Malicious Script Execution'],
    medium: ['After-Hours Access', 'Failed Authentication Spike', 'Unusual Login Pattern'],
  };

  const descriptions = {
    'Unusual Data Access': 'User accessed significantly more files than baseline behavior suggests.',
    'Privilege Escalation Attempt': 'Detected attempt to access resources beyond authorized scope.',
    'Mass File Download': 'Large volume of sensitive files downloaded in short timeframe.',
    'Data Exfiltration Detected': 'Potential data exfiltration through unauthorized channels detected.',
    'Credential Compromise': 'Account shows signs of credential theft or unauthorized access.',
    'Malicious Script Execution': 'Suspicious script or code execution detected from user workstation.',
    'After-Hours Access': 'System access detected outside normal working hours.',
    'Failed Authentication Spike': 'Multiple failed login attempts detected for this account.',
    'Unusual Login Pattern': 'Login from unusual location or device detected.',
  };

  const level = threatLevel as keyof typeof alertTypes;
  const types = alertTypes[level] || alertTypes.medium;
  const alertType = getRandomElement(types);

  return {
    user_activity_id: activityId,
    alert_type: alertType,
    severity: threatLevel as 'low' | 'medium' | 'high' | 'critical',
    description: descriptions[alertType as keyof typeof descriptions] || 'Anomalous behavior detected.',
    is_acknowledged: Math.random() > 0.7,
  };
}

export async function seedDatabase() {
  // Check if data already exists
  const { data: existingData } = await supabase
    .from('user_activities')
    .select('id')
    .limit(1);

  if (existingData && existingData.length > 0) {
    console.log('Database already seeded');
    return;
  }

  // Generate 50 user activities (40 normal, 10 anomalous)
  const activities = [];
  for (let i = 0; i < 40; i++) {
    activities.push(generateUserActivity(false));
  }
  for (let i = 0; i < 10; i++) {
    activities.push(generateUserActivity(true));
  }

  // Insert user activities
  const { data: insertedActivities, error: activityError } = await supabase
    .from('user_activities')
    .insert(activities)
    .select();

  if (activityError) {
    console.error('Error seeding user activities:', activityError);
    return;
  }

  // Generate alerts for high-risk users
  const alerts = [];
  for (const activity of insertedActivities || []) {
    if (activity.threat_level === 'high' || activity.threat_level === 'critical' || activity.threat_level === 'medium') {
      alerts.push(generateAlert(activity.id, activity.threat_level));
    }
  }

  if (alerts.length > 0) {
    const { error: alertError } = await supabase
      .from('threat_alerts')
      .insert(alerts);

    if (alertError) {
      console.error('Error seeding alerts:', alertError);
    }
  }

  // Insert ML model metrics
  const modelMetrics = [
    {
      model_type: 'Isolation Forest',
      accuracy: 0.9234,
      precision_score: 0.8912,
      recall_score: 0.9456,
      f1_score: 0.9176,
      false_positive_rate: 0.0523,
      training_date: new Date().toISOString(),
    },
    {
      model_type: 'Random Forest',
      accuracy: 0.9567,
      precision_score: 0.9234,
      recall_score: 0.9678,
      f1_score: 0.9451,
      false_positive_rate: 0.0312,
      training_date: new Date().toISOString(),
    },
  ];

  const { error: metricsError } = await supabase
    .from('ml_model_metrics')
    .insert(modelMetrics);

  if (metricsError) {
    console.error('Error seeding model metrics:', metricsError);
  }

  console.log('Database seeded successfully');
}
