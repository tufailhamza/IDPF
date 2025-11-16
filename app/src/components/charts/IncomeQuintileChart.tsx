import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    region: 'Ghana',
    q1: 25,
    q2: 35,
    q3: 22,
    q4: 13,
    q5: 5,
  },
  {
    region: 'Kenya',
    q1: 28,
    q2: 32,
    q3: 24,
    q4: 12,
    q5: 4,
  },
  {
    region: 'Rwanda',
    q1: 22,
    q2: 38,
    q3: 26,
    q4: 11,
    q5: 3,
  },
  {
    region: 'Overall',
    q1: 25,
    q2: 35,
    q3: 24,
    q4: 12,
    q5: 4,
  },
];

const IncomeQuintileChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income-Quintile Segmentation</CardTitle>
        <p className="text-sm text-muted-foreground">Poverty targeting: 89% Q2, 77% Q3 students reached</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category"
              dataKey="region" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value}%`,
                `Quintile ${name.toUpperCase()}`
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="q1" 
              stackId="a"
              fill="#ef4444" 
              name="Q1 (Poorest)"
            />
            <Bar 
              dataKey="q2" 
              stackId="a"
              fill="hsl(var(--success))" 
              name="Q2"
            />
            <Bar 
              dataKey="q3" 
              stackId="a"
              fill="hsl(var(--primary))" 
              name="Q3"
            />
            <Bar 
              dataKey="q4" 
              stackId="a"
              fill="#f59e0b" 
              name="Q4"
            />
            <Bar 
              dataKey="q5" 
              stackId="a"
              fill="#6b7280" 
              name="Q5 (Richest)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeQuintileChart;