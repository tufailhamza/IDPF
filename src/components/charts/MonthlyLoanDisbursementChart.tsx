import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan 2022", loanCount: 5, commitment: 1 },
  { month: "Feb 2022", loanCount: 4, commitment: 2 },
  { month: "Mar 2022", loanCount: 8, commitment: 2 },
  { month: "Apr 2022", loanCount: 8, commitment: 3 },
  { month: "May 2022", loanCount: 13, commitment: 3 },
  { month: "Jun 2022", loanCount: 9, commitment: 2 },
  { month: "Jul 2022", loanCount: 7, commitment: 1 },
  { month: "Aug 2022", loanCount: 15, commitment: 4 },
  { month: "Sep 2022", loanCount: 15, commitment: 4 },
  { month: "Oct 2022", loanCount: 12, commitment: 2 },
  { month: "Nov 2022", loanCount: 11, commitment: 4 },
  { month: "Dec 2022", loanCount: 6, commitment: 0 },
  { month: "Jan 2023", loanCount: 3, commitment: 3 },
  { month: "Feb 2023", loanCount: 5, commitment: 1 },
  { month: "Mar 2023", loanCount: 13, commitment: 3 },
  { month: "Apr 2023", loanCount: 7, commitment: 2 },
  { month: "May 2023", loanCount: 6, commitment: 2 },
  { month: "Jun 2023", loanCount: 9, commitment: 3 },
  { month: "Jul 2023", loanCount: 12, commitment: 2 },
  { month: "Aug 2023", loanCount: 12, commitment: 3 },
  { month: "Sep 2023", loanCount: 10, commitment: 4 },
  { month: "Oct 2023", loanCount: 9, commitment: 8 },
  { month: "Nov 2023", loanCount: 8, commitment: 4 },
  { month: "Dec 2023", loanCount: 13, commitment: 10 },
  { month: "Jan 2024", loanCount: 8, commitment: 5 },
  { month: "Feb 2024", loanCount: 7, commitment: 4 },
  { month: "Mar 2024", loanCount: 7, commitment: 7 },
  { month: "Apr 2024", loanCount: 12, commitment: 8 },
  { month: "May 2024", loanCount: 15, commitment: 6 },
  { month: "Jun 2024", loanCount: 5, commitment: 2 },
  { month: "Jul 2024", loanCount: 5, commitment: 1 },
  { month: "Aug 2024", loanCount: 8, commitment: 2 },
  { month: "Sep 2024", loanCount: 6, commitment: 1 },
  { month: "Oct 2024", loanCount: 12, commitment: 6 },
  { month: "Nov 2024", loanCount: 15, commitment: 17 },
  { month: "Dec 2024", loanCount: 8, commitment: 3 },
  { month: "Jan 2025", loanCount: 11, commitment: 8 },
  { month: "Feb 2025", loanCount: 18, commitment: 6 },
  { month: "Aug 2025", loanCount: 13, commitment: 13 },
];

const MonthlyLoanDisbursementChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Loan Disbursement Trends (2022-25)</CardTitle>
        <p className="text-sm text-muted-foreground">Loan volume and commitment over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Count / Scaled Value", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => value === "loanCount" ? "Loan Count" : "Commit (GHS M×5)"}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="commitment" 
              stroke="hsl(var(--warning))" 
              yAxisId="left"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--warning))", r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyLoanDisbursementChart;
