import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    category: 'Operations',
    shared: 45,
    chair: 35,
    foundation: 20,
  },
  {
    category: 'Technology',
    shared: 60,
    chair: 25,
    foundation: 15,
  },
  {
    category: 'Program Delivery',
    shared: 25,
    chair: 30,
    foundation: 45,
  },
  {
    category: 'Research & Development',
    shared: 30,
    chair: 40,
    foundation: 30,
  },
  {
    category: 'Marketing',
    shared: 50,
    chair: 30,
    foundation: 20,
  },
];

const CostSplitChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Split: Shared vs. Chair vs. Foundation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="category" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}%`,
                name === 'shared' ? 'Shared Costs' : 
                name === 'chair' ? 'Chair Funded' : 'Foundation Funded'
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
              dataKey="shared" 
              stackId="a"
              fill="hsl(var(--primary))" 
              name="Shared Costs"
            />
            <Bar 
              dataKey="chair" 
              stackId="a"
              fill="hsl(var(--secondary))" 
              name="Chair Funded"
            />
            <Bar 
              dataKey="foundation" 
              stackId="a"
              fill="hsl(var(--accent))" 
              name="Foundation Funded"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CostSplitChart;