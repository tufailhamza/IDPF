"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenderDistributionChartProps {
  dataSource?: "premier" | "sasl";
}

const fetchBaselineData = async (source: "premier" | "sasl" = "premier") => {
  const endpoint = source === "sasl" 
    ? "/api/sasl-baseline-data"
    : "/api/baseline-data";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch baseline data for ${source}`);
  }
  return response.json();
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
];

const GenderDistributionChart = ({ dataSource = "premier" }: GenderDistributionChartProps) => {
  const { data: baselineData, isLoading, error } = useQuery({
    queryKey: ["baseline-data", dataSource],
    queryFn: () => fetchBaselineData(dataSource),
  });

  // Transform data for the chart - Girls and Boys percentages
  const chartData = baselineData?.studentReach ? [
    { name: "Girls", value: baselineData.studentReach.girls || 0 },
    { name: "Boys", value: baselineData.studentReach.boys || 0 },
  ] : [
    { name: "Female", value: 52.3 },
    { name: "Male", value: 47.7 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="h-[280px] flex items-center justify-center text-destructive">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Student Gender Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ value }) => `${value.toFixed(1)}%`}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Percentage"]} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-2 mt-2">
          {chartData.map((item: any, index: number) => (
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