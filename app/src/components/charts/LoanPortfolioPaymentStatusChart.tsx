import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "In Repayment", value: 72.5, color: "hsl(220, 70%, 65%)" },
  { name: "Repayment in Arrears", value: 18.2, color: "hsl(var(--primary))" },
  { name: "Portfolio at Risk", value: 9.3, color: "hsl(220, 50%, 45%)" },
];

const LoanPortfolioPaymentStatusChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Portfolio Payment Status</CardTitle>
        <p className="text-sm text-muted-foreground">Current repayment performance breakdown</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={2}
              dataKey="value"
              label={({ value }) => `${Number(value).toFixed(2)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Percentage"]} />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
              iconType="square"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanPortfolioPaymentStatusChart;
