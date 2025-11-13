import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { category: 'Budget', value: 10000000, cumulative: 10000000, type: 'positive' },
  { category: 'Grants', value: -500000, cumulative: 9500000, type: 'negative' },
  { category: 'Salaries', value: -3200000, cumulative: 6300000, type: 'negative' },
  { category: 'Communications', value: -200000, cumulative: 6100000, type: 'negative' },
  { category: 'Consulting', value: -800000, cumulative: 5300000, type: 'negative' },
  { category: 'Operations', value: -600000, cumulative: 4700000, type: 'negative' },
  { category: 'Remaining', value: 4700000, cumulative: 4700000, type: 'total' },
];

const WaterfallChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Variance Waterfall by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value: number) => [
                `$${(value / 1000000).toFixed(2)}M`,
                'Amount'
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WaterfallChart;