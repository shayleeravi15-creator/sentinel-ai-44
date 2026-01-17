import { UserActivity } from '@/types/insider-threat';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, Legend, BarChart, Bar } from 'recharts';
import { Activity } from 'lucide-react';

interface BehaviorChartProps {
  activities: UserActivity[];
}

export function BehaviorChart({ activities }: BehaviorChartProps) {
  // Prepare scatter data for anomaly visualization
  const scatterData = activities.map(a => ({
    x: a.access_frequency,
    y: a.files_accessed,
    risk: a.risk_score,
    isAnomaly: a.is_anomaly,
    username: a.username,
    threatLevel: a.threat_level,
  }));

  // Prepare distribution data
  const distributionData = [
    { name: 'Normal', count: activities.filter(a => a.threat_level === 'normal').length, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Low', count: activities.filter(a => a.threat_level === 'low').length, fill: 'hsl(142, 71%, 35%)' },
    { name: 'Medium', count: activities.filter(a => a.threat_level === 'medium').length, fill: 'hsl(38, 92%, 50%)' },
    { name: 'High', count: activities.filter(a => a.threat_level === 'high').length, fill: 'hsl(0, 84%, 60%)' },
    { name: 'Critical', count: activities.filter(a => a.threat_level === 'critical').length, fill: 'hsl(0, 84%, 45%)' },
  ];

  // Risk score timeline (simulated)
  const timelineData = activities
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-20)
    .map((a, i) => ({
      time: i + 1,
      riskScore: a.risk_score,
      anomalies: a.is_anomaly ? 1 : 0,
    }));

  const getColor = (isAnomaly: boolean) => isAnomaly ? 'hsl(0, 84%, 60%)' : 'hsl(186, 100%, 50%)';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Anomaly Detection Scatter Plot */}
      <div className="cyber-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Behavioral Anomaly Detection
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Access Frequency vs Files Accessed (Isolation Forest)
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis 
              dataKey="x" 
              name="Access Frequency" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              stroke="hsl(222, 47%, 16%)"
            />
            <YAxis 
              dataKey="y" 
              name="Files Accessed" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              stroke="hsl(222, 47%, 16%)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 47%, 16%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 96%)',
              }}
              formatter={(value: any, name: string) => [value, name]}
              labelFormatter={(label) => `User Data Point`}
            />
            <Legend />
            <Scatter name="Normal Users" data={scatterData.filter(d => !d.isAnomaly)} fill="hsl(186, 100%, 50%)">
              {scatterData.filter(d => !d.isAnomaly).map((entry, index) => (
                <Cell key={`cell-${index}`} fill="hsl(186, 100%, 50%)" opacity={0.7} />
              ))}
            </Scatter>
            <Scatter name="Anomalies" data={scatterData.filter(d => d.isAnomaly)} fill="hsl(0, 84%, 60%)">
              {scatterData.filter(d => d.isAnomaly).map((entry, index) => (
                <Cell key={`cell-anomaly-${index}`} fill="hsl(0, 84%, 60%)" opacity={0.9} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Threat Distribution */}
      <div className="cyber-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyber-amber" />
          Threat Level Distribution
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Classification by Random Forest Model
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={distributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              stroke="hsl(222, 47%, 16%)"
            />
            <YAxis 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              stroke="hsl(222, 47%, 16%)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 47%, 16%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 96%)',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Score Timeline */}
      <div className="cyber-card border border-border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyber-green" />
          Risk Score Trend Analysis
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              stroke="hsl(222, 47%, 16%)"
            />
            <YAxis 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              stroke="hsl(222, 47%, 16%)"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 47%, 16%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 96%)',
              }}
            />
            <Area
              type="monotone"
              dataKey="riskScore"
              stroke="hsl(186, 100%, 50%)"
              strokeWidth={2}
              fill="url(#riskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
