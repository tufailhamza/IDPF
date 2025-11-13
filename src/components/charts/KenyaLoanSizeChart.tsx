import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { band: "0-50K", loanCount: 173, disbursed: 7.08, percentage: 5.0 },
  { band: "50-100K", loanCount: 1008, disbursed: 75.82, percentage: 28.9 },
  { band: "100-150K ⭐", loanCount: 1125, disbursed: 133.94, percentage: 32.3 },
  { band: "150-200K", loanCount: 537, disbursed: 91.86, percentage: 15.4 },
  { band: "200-300K", loanCount: 481, disbursed: 114.63, percentage: 13.8 },
  { band: "300-500K", loanCount: 130, disbursed: 43.55, percentage: 3.7 },
  { band: "500K-1M", loanCount: 23, disbursed: 14.11, percentage: 0.7 },
  { band: "1M+", loanCount: 6, disbursed: 7.65, percentage: 0.2 },
];

const KenyaLoanSizeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Size Distribution: Volume vs Value</CardTitle>
        <p className="text-sm text-muted-foreground">100-150K band is the sweet spot (32.3% of loans, 27.4% of value)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="band" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              label={{ value: "Size Bands (KES)", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Loan Count", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Disbursed (M KES)", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "disbursed") return [`KES ${value}M`, "Disbursed"];
                return [value, "Loan Count"];
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => value === "loanCount" ? "Loan Count" : "Disbursed (M KES)"}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="disbursed" 
              fill="hsl(var(--warning))" 
              yAxisId="right"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KenyaLoanSizeChart;
