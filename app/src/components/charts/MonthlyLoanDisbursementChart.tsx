"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const fetchMonthlyDisbursementTrends = async () => {
  const response = await fetch("/api/monthly-disbursement-trends");
  if (!response.ok) {
    throw new Error("Failed to fetch monthly disbursement trends");
  }
  return response.json();
};

const MonthlyLoanDisbursementChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthly-disbursement-trends"],
    queryFn: fetchMonthlyDisbursementTrends,
  });

  // Transform data for the chart
  // monthlyValue is in the original currency, monthlyVolume is the count
  const chartData = data?.map((item: any) => ({
    month: item.month,
    loanCount: item.monthlyVolume,
    commitment: item.monthlyValue / 1000000, // Convert to millions for display
  })) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Loan Disbursement Trends (2022-25)</CardTitle>
          <p className="text-sm text-muted-foreground">Loan volume and commitment over time</p>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] flex items-center justify-center text-muted-foreground">
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
          <CardTitle className="text-base">Monthly Loan Disbursement Trends (2022-25)</CardTitle>
          <p className="text-sm text-muted-foreground">Loan volume and commitment over time</p>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] flex items-center justify-center text-destructive">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Loan Disbursement Trends (2022-25)</CardTitle>
        <p className="text-sm text-muted-foreground">Loan volume and commitment over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "Count / Scaled Value", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => value === "loanCount" ? "Loan Count" : "Commit (GHS M×5)"}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="commitment" 
              stroke="hsl(var(--warning))" 
              yAxisId="left"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--warning))", r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyLoanDisbursementChart;
