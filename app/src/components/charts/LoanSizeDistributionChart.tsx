import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { band: "0-25K", loanCount: 54, commitment: 0.7 },
  { band: "25-50K", loanCount: 110, commitment: 4.8 },
  { band: "50-100K", loanCount: 124, commitment: 10.4 },
  { band: "100-200K", loanCount: 50, commitment: 8.3 },
  { band: "200-500K", loanCount: 40, commitment: 14.4 },
  { band: "500K+", loanCount: 1, commitment: 39.6 },
];

const LoanSizeDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Size Distribution: Volume vs Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 60, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="band" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Size Bands", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
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
              label={{ value: "Commitment (M GHS)", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
              formatter={(value) => value === "loanCount" ? "Loan Count" : "Commitment (M)"}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="commitment" 
              fill="hsl(var(--success))" 
              yAxisId="right"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanSizeDistributionChart;
