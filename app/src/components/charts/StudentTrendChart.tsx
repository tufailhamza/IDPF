import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { year: "2020", students: 45000 },
  { year: "2021", students: 62000 },
  { year: "2022", students: 78000 },
  { year: "2023", students: 89000 },
  { year: "2024", students: 104231 },
];

const StudentTrendChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Students Reached (5-Year Trend)</CardTitle>
        <p className="text-sm text-muted-foreground">Cumulative student enrollment</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="year" 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip 
              formatter={(value) => [`${Number(value).toLocaleString()} students`, "Students"]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="students" 
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

export default StudentTrendChart;