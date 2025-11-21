import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    grantee: 'Education First Ghana',
    planned: 850000,
    paid: 680000,
    remaining: 170000,
  },
  {
    grantee: 'Rwanda Learning Initiative',
    planned: 1200000,
    paid: 1200000,
    remaining: 0,
  },
  {
    grantee: 'Kenya Skills Academy',
    planned: 750000,
    paid: 450000,
    remaining: 300000,
  },
  {
    grantee: 'Uganda Youth Program',
    planned: 950000,
    paid: 760000,
    remaining: 190000,
  },
  {
    grantee: 'Tanzania Education Hub',
    planned: 600000,
    paid: 120000,
    remaining: 480000,
  },
];

const GrantDisbursementChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grant Disbursement Timeline (Planned vs. Paid)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data} 
            layout="horizontal"
            margin={{ top: 60, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <YAxis 
              type="category"
              dataKey="grantee" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              width={120}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `$${(value / 1000).toFixed(0)}K`,
                name === 'planned' ? 'Planned Amount' : 
                name === 'paid' ? 'Amount Paid' : 'Remaining'
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
            />
            <Bar 
              dataKey="paid" 
              stackId="a"
              fill="hsl(var(--success))" 
              name="Amount Paid"
            />
            <Bar 
              dataKey="remaining" 
              stackId="a"
              fill="hsl(var(--warning))" 
              name="Remaining"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GrantDisbursementChart;