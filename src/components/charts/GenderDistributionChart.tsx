import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Female", value: 52.3 },
  { name: "Male", value: 47.7 },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
];

const GenderDistributionChart = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Student Gender Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ value }) => `${value}%`}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-2 mt-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span>{item.name}</span>
              </div>
              <div className="font-medium">
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenderDistributionChart;