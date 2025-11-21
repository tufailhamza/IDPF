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
  // Extract year from month string for display
  const chartData = data?.map((item: any) => {
    const monthStr = String(item.month || "");
    // Try to extract year from month string (e.g., "Jan 2022" or "2022-01")
    let year = "";
    const yearMatch = monthStr.match(/\b(202[2-5])\b/);
    if (yearMatch) {
      year = yearMatch[1];
    } else {
      // Try to extract from date format
      const dateMatch = monthStr.match(/(\d{4})/);
      if (dateMatch) {
        year = dateMatch[1];
      }
    }
    
    return {
      month: monthStr,
      year: year,
      loanCount: item.monthlyVolume,
      commitment: item.monthlyValue / 1000000, // Convert to millions for display
    };
  }) || [];

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
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tickFormatter={(value, index) => {
                // Extract just the month name (first 3 chars or first word)
                const monthOnly = String(value).split(/\s+/)[0].substring(0, 3);
                return monthOnly;
              }}
            />
            <XAxis 
              xAxisId="year"
              dataKey="year"
              orientation="bottom"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 'bold' }}
              height={20}
              interval={0}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value, index) => {
                // Only show year if it's different from previous or first item
                if (index === 0 || chartData[index]?.year !== chartData[index - 1]?.year) {
                  return chartData[index]?.year || "";
                }
                return "";
              }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8 }}
              label={{ value: "Monthly Volume", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", offset: -2 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8 }}
              label={{ value: "Loan Value", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))",offset: 9 }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
              formatter={(value) => value === "loanCount" ? "Monthly Volume" : "Loan Value Committed"}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              name="Monthly Volume"
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="commitment" 
              stroke="hsl(var(--warning))" 
              name="Loan Value Committed"
              yAxisId="right"
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
