import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Classroom Construction", value: 65.4, amount: 319.57, loans: 2247, color: "hsl(var(--primary))" },
  { name: "Repairs/Maintenance", value: 8.6, amount: 42.24, loans: 320, color: "hsl(var(--primary-light))" },
  { name: "Salaries/Staff Cost", value: 6.3, amount: 30.58, loans: 216, color: "hsl(var(--warning))" },
  { name: "Equipment Purchase", value: 5.8, amount: 28.34, loans: 189, color: "hsl(221, 61%, 35%)" },
  { name: "Land Acquisition", value: 4.2, amount: 20.52, loans: 142, color: "hsl(221, 61%, 30%)" },
  { name: "Working Capital", value: 3.9, amount: 19.06, loans: 156, color: "hsl(221, 61%, 25%)" },
  { name: "Other", value: 5.8, amount: 28.34, loans: 214, color: "hsl(221, 61%, 20%)" },
];

const KenyaLoanPurposeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Portfolio Composition by Purpose</CardTitle>
        <p className="text-sm text-muted-foreground">Infrastructure-focused lending dominates portfolio</p>
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
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                const entry = props.payload;
                return [`${value}% (KES ${entry.amount}M, ${entry.loans} loans)`, "Distribution"];
              }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="square"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KenyaLoanPurposeChart;
