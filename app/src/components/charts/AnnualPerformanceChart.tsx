import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { year: "2022", loanCount: 110, commitment: 6.5 },
  { year: "2023", loanCount: 90, commitment: 7 },
  { year: "2024", loanCount: 101, commitment: 12.3 },
  { year: "2025", loanCount: 78, commitment: 13.2 },
];

const AnnualPerformanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Annual Performance: Loans vs Commitment</CardTitle>
        <p className="text-sm text-muted-foreground">Year-over-year comparison</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 60, right: 50, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Year", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
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
            <Tooltip 
              formatter={(value, name) => {
                if (name === "commitment") return [`${value}M GHS`, "Commitment"];
                return [value, "Loan Count"];
              }}
            />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
              formatter={(value) => value === "loanCount" ? "Loan Count" : "Commitment (M GHS)"}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="commitment" 
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

export default AnnualPerformanceChart;
