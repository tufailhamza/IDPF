import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { year: "2022", loanCount: 84, disbursed: 12.17, avgLoan: 144.875 },
  { year: "2023", loanCount: 894, disbursed: 119.49, avgLoan: 133.658 },
  { year: "2024", loanCount: 1428, disbursed: 207.42, avgLoan: 145.253 },
  { year: "2025*", loanCount: 1077, disbursed: 149.41, avgLoan: 138.727 },
];

const KenyaYearlyGrowthChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Yearly Growth Trajectory</CardTitle>
        <p className="text-sm text-muted-foreground">2023: +964% volume growth (pilot to scale-up) | 2024: +60% sustained growth | *2025 YTD through August</p>
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
              label={{ value: "Disbursed (M KES)", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "disbursed") return [`KES ${value}M`, "Disbursed"];
                if (name === "avgLoan") return [`KES ${(value as number * 1000).toLocaleString()}`, "Avg Loan"];
                return [value, "Loan Count"];
              }}
            />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
              formatter={(value) => {
                if (value === "loanCount") return "Loan Count";
                if (value === "disbursed") return "Disbursed (M KES)";
                return value;
              }}
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

export default KenyaYearlyGrowthChart;
