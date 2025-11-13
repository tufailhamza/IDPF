import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { branch: "Nairobi-Kasarani", commitment: 53.77, loans: 458, color: "hsl(var(--warning))" },
  { branch: "Nairobi-Kayole", commitment: 46.43, loans: 335, color: "hsl(var(--primary-light))" },
  { branch: "Nairobi-Kariobangi", commitment: 25.22, loans: 187, color: "hsl(var(--primary))" },
  { branch: "Nairobi-Githurai", commitment: 22.15, loans: 156, color: "hsl(221, 61%, 35%)" },
  { branch: "Nakuru Central", commitment: 19.88, loans: 142, color: "hsl(221, 61%, 30%)" },
  { branch: "Mombasa-Nyali", commitment: 18.34, loans: 128, color: "hsl(221, 61%, 25%)" },
  { branch: "Kisumu Central", commitment: 15.67, loans: 115, color: "hsl(221, 61%, 22%)" },
  { branch: "Eldoret-Langas", commitment: 14.21, loans: 98, color: "hsl(221, 61%, 20%)" },
  { branch: "Thika Town", commitment: 12.55, loans: 89, color: "hsl(221, 61%, 18%)" },
  { branch: "Meru Central", commitment: 11.43, loans: 76, color: "hsl(221, 61%, 16%)" },
];

const KenyaBranchPerformanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Branches by Total Disbursement (KES Millions)</CardTitle>
        <p className="text-sm text-muted-foreground">Branch performance ranking - Top 10 represent 53.7% of portfolio</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 20, right: 30, left: 140, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              type="number" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Total Disbursement in KES Millions", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              type="category" 
              dataKey="branch" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={130}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "commitment") return [`KES ${value}M`, "Disbursement"];
                return [value, name];
              }}
            />
            <Bar dataKey="commitment" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KenyaBranchPerformanceChart;
