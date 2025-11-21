import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "INFRASTRUCTURE", value: 88.1, color: "hsl(var(--primary-light))" },
  { name: "VEHICLE", value: 10, color: "hsl(var(--warning))" },
  { name: "LAND", value: 1.5, color: "hsl(var(--success))" },
  { name: "WORKING CAPITAL", value: 0.4, color: "hsl(var(--primary))" },
];

const LoanPortfolioCompositionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Portfolio Composition by Purpose</CardTitle>
        <p className="text-sm text-muted-foreground">Distribution of loan purposes</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={150}
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
              align="left"
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

export default LoanPortfolioCompositionChart;
