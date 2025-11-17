import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users } from "lucide-react";

const data = [
  { month: 'Jan', planned: 45, actual: 43 },
  { month: 'Feb', planned: 47, actual: 46 },
  { month: 'Mar', planned: 50, actual: 48 },
  { month: 'Apr', planned: 52, actual: 51 },
  { month: 'May', planned: 55, actual: 53 },
  { month: 'Jun', planned: 58, actual: 56 },
];

const HeadcountVarianceCard = () => {
  const currentHeadcount = 56;
  const plannedHeadcount = 58;
  const variance = ((currentHeadcount - plannedHeadcount) / plannedHeadcount * 100).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Headcount & Salary Variance (Ed Team)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Headcount</p>
              <p className="text-3xl font-bold text-foreground">{currentHeadcount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Variance vs Plan</p>
              <div className="flex items-center gap-1">
                <p className="text-3xl font-bold text-destructive">{variance}%</p>
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">FX-Adjusted Projection</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data}>
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  domain={[40, 60]}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'planned' ? 'Planned' : 'Actual'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadcountVarianceCard;