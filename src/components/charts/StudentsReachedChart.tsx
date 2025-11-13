import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2009', students: 850 },
  { year: '2010', students: 1200 },
  { year: '2011', students: 2100 },
  { year: '2012', students: 3500 },
  { year: '2013', students: 5200 },
  { year: '2014', students: 8100 },
  { year: '2015', students: 12500 },
  { year: '2016', students: 18200 },
  { year: '2017', students: 25800 },
  { year: '2018', students: 35200 },
  { year: '2019', students: 48600 },
  { year: '2020', students: 63400 },
  { year: '2021', students: 78900 },
  { year: '2022', students: 94200 },
  { year: '2023', students: 108500 },
  { year: '2024', students: 124800 },
];

const StudentsReachedChart = () => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Total Students Reached (2009-2024)</CardTitle>
        <p className="text-sm text-muted-foreground">Cumulative student reach demonstrating 15-year scale</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
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
              formatter={(value: number) => [
                `${value.toLocaleString()} students`,
                'Total Reached'
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="students" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentsReachedChart;