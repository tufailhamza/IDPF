import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    year: '2020',
    inService: 8200,
    preService: 12400,
  },
  {
    year: '2021',
    inService: 10500,
    preService: 14800,
  },
  {
    year: '2022',
    inService: 12300,
    preService: 16200,
  },
  {
    year: '2023',
    inService: 13800,
    preService: 17500,
  },
  {
    year: '2024',
    inService: 14000,
    preService: 18000,
  },
];

const TeacherCapacityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher/Tutor Capacity Built</CardTitle>
        <p className="text-sm text-muted-foreground">Human-capital impact: in-service vs. pre-service training</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} teachers`,
                name === 'inService' ? 'In-Service Training' : 'Pre-Service Training'
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
              dataKey="inService" 
              fill="hsl(var(--primary))" 
              name="In-Service Training"
            />
            <Bar 
              dataKey="preService" 
              fill="hsl(var(--secondary))" 
              name="Pre-Service Training"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeacherCapacityChart;