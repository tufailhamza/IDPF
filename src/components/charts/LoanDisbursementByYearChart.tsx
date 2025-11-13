import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from "recharts";

const data = [
  { year: "2022", annualValue: 125.5, annualVolume: 890, averageValue: 141.0 },
  { year: "2023", annualValue: 148.2, annualVolume: 1050, averageValue: 141.1 },
  { year: "2024", annualValue: 165.8, annualVolume: 1180, averageValue: 140.5 },
  { year: "2025", annualValue: 49.1, annualVolume: 364, averageValue: 134.9 },
];

const LoanDisbursementByYearChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Disbursement by Year</CardTitle>
        <p className="text-sm text-muted-foreground">Annual value, volume, and average loan size</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Value (KES M)', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Volume / Avg (KES K)', angle: 90, position: 'insideRight', fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="annualValue" fill="hsl(220, 70%, 65%)" name="Annual Value (KES M)" radius={4} />
            <Bar yAxisId="right" dataKey="annualVolume" fill="hsl(var(--primary))" name="Annual Volume" radius={4} />
            <Line yAxisId="right" type="monotone" dataKey="averageValue" stroke="hsl(220, 50%, 45%)" strokeWidth={3} name="Average Value (KES K)" dot={{ fill: "hsl(220, 50%, 45%)", r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanDisbursementByYearChart;
