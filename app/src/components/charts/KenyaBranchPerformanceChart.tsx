"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const fetchTopBranches = async () => {
  const response = await fetch("/api/top-branches");
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch top branches");
  }
  const data = await response.json();
  // Handle case where API returns error object instead of array
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const COLORS = [
  "hsl(var(--warning))",
  "hsl(var(--primary-light))",
  "hsl(var(--primary))",
  "hsl(221, 61%, 35%)",
  "hsl(221, 61%, 30%)",
  "hsl(221, 61%, 25%)",
  "hsl(221, 61%, 22%)",
  "hsl(221, 61%, 20%)",
  "hsl(221, 61%, 18%)",
  "hsl(221, 61%, 16%)",
];

const KenyaBranchPerformanceChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-branches"],
    queryFn: fetchTopBranches,
  });

  // Transform data for the chart - convert to millions
  const chartData = data && Array.isArray(data) && data.length > 0
    ? data.map((item: any, index: number) => ({
        branch: item.branch || "Unknown",
        commitment: item.commitment ? item.commitment / 1000000 : 0, // Convert to millions
        color: COLORS[index % COLORS.length],
      }))
    : [];

  // Debug logging
  if (data && !isLoading && !error) {
    console.log(`KenyaBranchPerformanceChart:`, {
      rawData: data,
      chartData,
      dataLength: data?.length || 0,
      chartDataLength: chartData.length,
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Branches by Total Disbursement (KES Millions)</CardTitle>
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
          <CardTitle className="text-base">Top 10 Branches by Total Disbursement (KES Millions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-destructive">
            Error loading chart data: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Branches by Total Disbursement (KES Millions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Branches by Total Disbursement (KES Millions)</CardTitle>

      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData} 
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
                if (name === "commitment") return [`KES ${Number(value).toFixed(2)}M`, "Disbursement"];
                return [value, name];
              }}
            />
            <Bar dataKey="commitment" radius={[0, 4, 4, 0]}>
              {chartData.map((entry: any, index: number) => (
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
