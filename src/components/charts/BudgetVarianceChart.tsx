import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    category: 'Q1 2024',
    budget: 2500000,
    actual: 2350000,
    forecast: 2400000,
    variance: -150000,
  },
  {
    category: 'Q2 2024',
    budget: 2800000,
    actual: 2950000,
    forecast: 2900000,
    variance: 150000,
  },
  {
    category: 'Q3 2024',
    budget: 3200000,
    actual: 3100000,
    forecast: 3150000,
    variance: -100000,
  },
  {
    category: 'Q4 2024',
    budget: 3500000,
    actual: 0,
    forecast: 3600000,
    variance: 100000,
  },
];

const BudgetVarianceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Foundation Budget vs. Actual vs. Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="category" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `$${(value / 1000000).toFixed(2)}M`,
                name === 'budget' ? 'Budget' : 
                name === 'actual' ? 'Actual' : 
                name === 'forecast' ? 'Forecast' : 'Variance'
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar dataKey="budget" fill="hsl(var(--primary))" name="Budget" />
            <Bar dataKey="actual" fill="hsl(var(--secondary))" name="Actual" />
            <Bar dataKey="forecast" fill="hsl(var(--accent))" name="Forecast" />
            <Line 
              type="monotone" 
              dataKey="variance" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={3}
              name="Variance"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetVarianceChart;