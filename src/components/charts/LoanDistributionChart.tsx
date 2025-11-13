import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "New Loans", value: 420, color: "hsl(var(--primary))" },
  { name: "Outstanding", value: 2840, color: "hsl(var(--primary-light))" },
];

const LoanDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loans Distributed</CardTitle>
        <p className="text-sm text-muted-foreground">New vs Outstanding Balance</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="value" radius={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="text-center space-y-1">
              <div className="text-lg font-bold text-foreground">{item.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{item.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanDistributionChart;