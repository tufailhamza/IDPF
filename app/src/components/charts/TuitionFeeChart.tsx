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

const formatCurrency = (num: number): string => {
  return `KES ${Math.round(num).toLocaleString()}`;
};

const TuitionFeeChart = ({ dataSource = "premier" }: TuitionFeeChartProps) => {
  const { data: baselineData, isLoading, error } = useQuery({
    queryKey: ["baseline-data", dataSource],
    queryFn: () => fetchBaselineData(dataSource),
  });

  // Transform quartiles data for the chart
  const chartData = baselineData?.annualFees ? [
    { 
      range: "Q1", 
      value: baselineData.annualFees.quartile1 || 0,
      label: formatCurrency(baselineData.annualFees.quartile1 || 0),
    },
    { 
      range: "Q2", 
      value: baselineData.annualFees.quartile2 || 0,
      label: formatCurrency(baselineData.annualFees.quartile2 || 0),
    },
    { 
      range: "Q3", 
      value: baselineData.annualFees.quartile3 || 0,
      label: formatCurrency(baselineData.annualFees.quartile3 || 0),
    },
    { 
      range: "Q4", 
      value: baselineData.annualFees.quartile4 || 0,
      label: formatCurrency(baselineData.annualFees.quartile4 || 0),
    },
  ] : [
    { range: "< $40", schools: 45 },
    { range: "$40-65", schools: 48 },
    { range: "$65-85", schools: 6 },
    { range: "> $85", schools: 1 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Recipient School Tuition Rates</CardTitle>
          <p className="text-sm text-muted-foreground">School distribution by affordability quartiles</p>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
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
          <p className="text-sm text-muted-foreground">School distribution by affordability quartiles</p>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-destructive">
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
        <p className="text-sm text-muted-foreground">School distribution by affordability quartiles</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="range" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Tuition Fee (KES)', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(Number(value)), "Tuition Fee"]}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {chartData.map((item: any) => (
            <div key={item.range} className="text-center space-y-1">
              <div className="text-sm font-bold text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">Quartile {item.range}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TuitionFeeChart;