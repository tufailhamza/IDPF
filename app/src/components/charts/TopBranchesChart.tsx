"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopBranchesChartProps {
  dataSource?: "premier" | "sasl";
}

const fetchTopBranches = async (source: "premier" | "sasl" = "premier") => {
  const endpoint = source === "sasl" 
    ? "/api/sasl-top-branches"
    : "/api/top-branches";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch top branches for ${source}`);
  }
  return response.json();
};

const TopBranchesChart = ({ dataSource = "premier" }: TopBranchesChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-branches", dataSource],
    queryFn: () => fetchTopBranches(dataSource),
  });

  // Transform data for the chart - convert to millions for stacked bar chart
  const chartData = data?.map((item: any, index: number) => ({
    branch: item.branch,
    commitment: item.commitment / 1000000, // Convert to millions
  })) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Branches by Total Loan Commitment (KES Millions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Branches by Total Loan Commitment (KES Millions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-destructive">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Branches by Total Loan Commitment (KES Millions)</CardTitle>
       
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              type="number" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Total Commitment in KES Millions", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              type="category" 
              dataKey="branch" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={110}
            />
            <Tooltip formatter={(value) => [`KES ${Number(value).toFixed(2)}M`, "Commitment"]} />
            <Bar dataKey="commitment" stackId="a" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopBranchesChart;
