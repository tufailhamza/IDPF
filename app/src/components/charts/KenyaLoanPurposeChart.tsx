"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const fetchLoanPurposeDisbursement = async () => {
  const response = await fetch("/api/loan-purpose-disbursement");
  if (!response.ok) {
    throw new Error("Failed to fetch loan purpose disbursement");
  }
  return response.json();
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary-light))",
  "hsl(var(--warning))",
  "hsl(221, 61%, 35%)",
  "hsl(221, 61%, 30%)",
  "hsl(221, 61%, 25%)",
  "hsl(221, 61%, 20%)",
  "hsl(221, 61%, 18%)",
  "hsl(221, 61%, 16%)",
  "hsl(221, 61%, 14%)",
];

const KenyaLoanPurposeChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["loan-purpose-disbursement"],
    queryFn: fetchLoanPurposeDisbursement,
  });

  // Calculate total and percentages
  const total = data?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
  
  const chartData = data?.map((item: any, index: number) => ({
    name: item.name,
    value: total > 0 ? Math.round((item.amount / total) * 100 * 100) / 100 : 0, // Round to 2 decimals
    amount: item.amount / 1000000, // Convert to millions
    loans: item.loans || 0,
    color: COLORS[index % COLORS.length],
  })) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Portfolio Composition by Purpose</CardTitle>
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
          <CardTitle className="text-base">Loan Portfolio Composition by Purpose</CardTitle>
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
        <CardTitle className="text-base">Loan Portfolio Composition by Purpose</CardTitle>
        <p className="text-sm text-muted-foreground">Infrastructure-focused lending dominates portfolio</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={150}
              paddingAngle={2}
              dataKey="value"
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                const entry = props.payload;
                return [`${value}% (KES ${entry.amount}M, ${entry.loans} loans)`, "Distribution"];
              }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="square"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KenyaLoanPurposeChart;
