import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { branch: "ADUM BRANCH", commitment: 18.61, color: "hsl(var(--warning))" },
  { branch: "ABUAKWA BRANCH", commitment: 6.88, color: "hsl(var(--primary-light))" },
  { branch: "ELLIS AVE BR", commitment: 4.34, color: "hsl(var(--primary))" },
  { branch: "MATAHEKO BRANCH", commitment: 2.21, color: "hsl(221, 61%, 35%)" },
  { branch: "BEREKUM BRANCH", commitment: 1.70, color: "hsl(221, 61%, 30%)" },
  { branch: "SUNYANI BRANCH", commitment: 1.07, color: "hsl(221, 61%, 25%)" },
  { branch: "ATEBUBU BRANCH", commitment: 0.82, color: "hsl(221, 61%, 22%)" },
  { branch: "KONONGO BRANCH", commitment: 0.80, color: "hsl(221, 61%, 20%)" },
  { branch: "CAPE COAST BR", commitment: 0.62, color: "hsl(221, 61%, 18%)" },
  { branch: "MANKESIM BRANCH", commitment: 0.58, color: "hsl(221, 61%, 16%)" },
];

const TopBranchesChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Branches by Total Loan Commitment (GHS Millions)</CardTitle>
        <p className="text-sm text-muted-foreground">Branch performance ranking</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              type="number" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Total Commitment in GHS Millions", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              type="category" 
              dataKey="branch" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={110}
            />
            <Tooltip formatter={(value) => [`GHS ${value}M`, "Commitment"]} />
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

export default TopBranchesChart;
