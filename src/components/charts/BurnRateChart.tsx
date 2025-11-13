import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, ComposedChart } from 'recharts';

const data = [
  { month: 'Jan', actual: 850000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Feb', actual: 780000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Mar', actual: 920000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Apr', actual: 750000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'May', actual: 830000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Jun', actual: 890000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Jul', actual: 760000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Aug', actual: 810000, target: 800000, upper: 900000, lower: 700000 },
  { month: 'Sep', actual: 870000, target: 800000, upper: 900000, lower: 700000 },
];

const BurnRateChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Burn Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `$${(value / 1000).toFixed(0)}K`,
                name === 'actual' ? 'Actual Burn' : 
                name === 'target' ? 'Target' : 
                name === 'upper' ? 'Upper Band' : 'Lower Band'
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            {/* Target band area */}
            <Area
              dataKey="upper"
              fill="hsl(var(--muted))"
              fillOpacity={0.3}
              stroke="none"
            />
            <Area
              dataKey="lower"
              fill="hsl(var(--background))"
              fillOpacity={1}
              stroke="none"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              name="Actual Burn"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BurnRateChart;