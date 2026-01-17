-- Create user_activities table for storing behavioral data
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  logout_time TIMESTAMP WITH TIME ZONE,
  access_frequency INTEGER NOT NULL DEFAULT 1,
  files_accessed INTEGER NOT NULL DEFAULT 0,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  after_hours_access BOOLEAN NOT NULL DEFAULT false,
  unusual_data_transfer BOOLEAN NOT NULL DEFAULT false,
  sensitive_files_accessed INTEGER NOT NULL DEFAULT 0,
  risk_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  threat_level VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (threat_level IN ('normal', 'low', 'medium', 'high', 'critical')),
  is_anomaly BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create threat_alerts table
CREATE TABLE public.threat_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_activity_id UUID REFERENCES public.user_activities(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  is_acknowledged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ml_model_metrics table for tracking model performance
CREATE TABLE public.ml_model_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_type VARCHAR(50) NOT NULL,
  accuracy DECIMAL(5,4) NOT NULL,
  precision_score DECIMAL(5,4) NOT NULL,
  recall_score DECIMAL(5,4) NOT NULL,
  f1_score DECIMAL(5,4) NOT NULL,
  false_positive_rate DECIMAL(5,4) NOT NULL,
  training_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read for demo)
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (demo purposes)
CREATE POLICY "Allow public read access on user_activities" 
ON public.user_activities FOR SELECT USING (true);

CREATE POLICY "Allow public read access on threat_alerts" 
ON public.threat_alerts FOR SELECT USING (true);

CREATE POLICY "Allow public read access on ml_model_metrics" 
ON public.ml_model_metrics FOR SELECT USING (true);

-- Create policies for insert (demo purposes)
CREATE POLICY "Allow public insert on user_activities" 
ON public.user_activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on threat_alerts" 
ON public.threat_alerts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on threat_alerts" 
ON public.threat_alerts FOR UPDATE USING (true);