"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TuitionFeeChartProps {
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

const TuitionFeeChart = ({ dataSource = "premier" }: TuitionFeeChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["baseline-data", dataSource],
    queryFn: () => fetchBaselineData(dataSource),
  });

  // Transform data for the chart - quartiles from COL AQ
  const chartData = data?.annualFees ? [
    { quartile: "Quartile 1", value: data.annualFees.quartile1 || 0 },
    { quartile: "Quartile 2", value: data.annualFees.quartile2 || 0 },
    { quartile: "Quartile 3", value: data.annualFees.quartile3 || 0 },
    { quartile: "Quartile 4", value: data.annualFees.quartile4 || 0 },
  ] : [
    { quartile: "Quartile 1", value: 0 },
    { quartile: "Quartile 2", value: 0 },
    { quartile: "Quartile 3", value: 0 },
    { quartile: "Quartile 4", value: 0 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Recipient School Tuition Rates</CardTitle>
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
          <CardTitle className="text-base">Loan Recipient School Tuition Rates</CardTitle>
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
        <CardTitle className="text-base">Loan Recipient School Tuition Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="quartile" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Tuition Fee (USD)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              formatter={(value: number) => [`$${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`, "Tuition Fee"]}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TuitionFeeChart;
