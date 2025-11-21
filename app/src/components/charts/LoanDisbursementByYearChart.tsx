"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from "recharts";

interface LoanDisbursementByYearChartProps {
  dataSource?: "premier" | "sasl";
}

const fetchLoanDisbursementSummary = async (source: "premier" | "sasl" = "premier") => {
  const endpoint = source === "sasl" 
    ? "/api/sasl-loan-disbursement-summary"
    : "/api/loan-disbursement-summary";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch loan disbursement summary for ${source}`);
  }
  return response.json();
};

const LoanDisbursementByYearChart = ({ dataSource = "premier" }: LoanDisbursementByYearChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["loan-disbursement-summary", dataSource],
    queryFn: () => fetchLoanDisbursementSummary(dataSource),
  });

  // Transform data for the chart
  // annualValue is in the original currency, we need to convert to millions for display
  // annualVolume is the count
  // averageValue is in thousands
  const chartData = data?.map((item: any) => ({
    year: item.year,
    annualValue: item.annualValue / 1000000, // Convert to millions
    annualVolume: item.annualVolume,
    averageValue: item.averageValue / 1000, // Convert to thousands
  })) || [
    { year: "2022", annualValue: 125.5, annualVolume: 890, averageValue: 141.0 },
    { year: "2023", annualValue: 148.2, annualVolume: 1050, averageValue: 141.1 },
    { year: "2024", annualValue: 165.8, annualVolume: 1180, averageValue: 140.5 },
    { year: "2025", annualValue: 49.1, annualVolume: 364, averageValue: 134.9 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Disbursement by Year</CardTitle>
          <p className="text-sm text-muted-foreground">Annual value, volume, and average loan size</p>
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
          <CardTitle className="text-base">Loan Disbursement by Year</CardTitle>
          <p className="text-sm text-muted-foreground">Annual value, volume, and average loan size</p>
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
        <CardTitle className="text-base">Loan Disbursement by Year</CardTitle>
        <p className="text-sm text-muted-foreground">Annual value, volume, and average loan size</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData} margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Value (KES M)', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              label={{ value: 'Volume', angle: 90, position: 'insideRight', fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="avg"
              orientation="right"
              tick={{ fill: "hsl(220, 50%, 45%)", fontSize: 10 }}
              hide={true}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
            />
            <Bar yAxisId="left" dataKey="annualValue" fill="hsl(220, 70%, 65%)" name="Annual Value (KES M)" radius={4} />
            <Bar yAxisId="right" dataKey="annualVolume" fill="hsl(var(--primary))" name="Annual Volume" radius={4} />
            <Line yAxisId="avg" type="monotone" dataKey="averageValue" stroke="hsl(220, 50%, 45%)" strokeWidth={3} name="Average Value (KES K)" dot={{ fill: "hsl(220, 50%, 45%)", r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanDisbursementByYearChart;
