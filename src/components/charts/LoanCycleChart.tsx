import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { cycle: "1", loans: 1245 },
  { cycle: "2", loans: 890 },
  { cycle: "3", loans: 650 },
  { cycle: "4", loans: 480 },
  { cycle: "5", loans: 320 },
  { cycle: "6", loans: 185 },
  { cycle: "7", loans: 95 },
  { cycle: "8", loans: 52 },
  { cycle: "9", loans: 28 },
  { cycle: "10", loans: 15 },
  { cycle: "11", loans: 8 },
  { cycle: "12", loans: 4 },
  { cycle: "13", loans: 2 },
];

const LoanCycleChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Number of Loans Issued by Cycle</CardTitle>
        <p className="text-sm text-muted-foreground">Loan distribution across repayment cycles</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="cycle" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Loan Cycle', position: 'insideBottom', offset: -5, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Number of Loans', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip formatter={(value) => [`${value} loans`, "Loans Issued"]} />
            <Line 
              type="monotone" 
              dataKey="loans" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanCycleChart;
