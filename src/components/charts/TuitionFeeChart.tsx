import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { range: "< $40", schools: 45 },
  { range: "$40-65", schools: 48 },
  { range: "$65-85", schools: 6 },
  { range: "> $85", schools: 1 },
];

const TuitionFeeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Average Tuition Fee Bands</CardTitle>
        <p className="text-sm text-muted-foreground">School distribution by affordability</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="range" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip formatter={(value) => [`${value} schools`, "Schools"]} />
            <Bar dataKey="schools" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.range} className="text-center space-y-1">
              <div className="text-lg font-bold text-foreground">{item.schools}</div>
              <div className="text-xs text-muted-foreground">{item.range}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TuitionFeeChart;