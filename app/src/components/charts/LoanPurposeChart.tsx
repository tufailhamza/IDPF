"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LoanPurposeChartProps {
  dataSource?: "premier" | "sasl";
}

const fetchLoanPurposeDisbursement = async (source: "premier" | "sasl" = "premier") => {
  const endpoint = source === "sasl" 
    ? "/api/sasl-loan-purpose-disbursement"
    : "/api/loan-purpose-disbursement";
  const response = await fetch(endpoint);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch loan purpose disbursement for ${source}`);
  }
  const data = await response.json();
  // Handle case where API returns error object instead of array
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const formatCurrency = (num: number): string => {
  return `KES ${Math.round(num / 1000)}K`;
};

const LoanPurposeChart = ({ dataSource = "premier" }: LoanPurposeChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["loan-purpose-disbursement", dataSource],
    queryFn: () => fetchLoanPurposeDisbursement(dataSource),
  });

  // Transform data for the chart - convert to thousands for display
  const chartData = data && Array.isArray(data) && data.length > 0
    ? data.map((item: any) => ({
        name: item.name || "Unknown",
        amount: item.amount ? item.amount / 1000 : 0, // Convert to thousands
        amountFormatted: formatCurrency(item.amount || 0),
      }))
    : [];

  // Debug logging
  if (data && !isLoading && !error) {
    console.log(`LoanPurposeChart (${dataSource}):`, {
      rawData: data,
      chartData,
      dataLength: data?.length || 0,
      chartDataLength: chartData.length,
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Disbursement by Loan Purpose</CardTitle>
          <p className="text-sm text-muted-foreground">Loan distribution by purpose</p>
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
          <CardTitle className="text-base">Disbursement by Loan Purpose</CardTitle>
          <p className="text-sm text-muted-foreground">Loan distribution by purpose</p>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="h-[280px] flex items-center justify-center text-destructive">
            Error loading chart data: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Disbursement by Loan Purpose</CardTitle>
          <p className="text-sm text-muted-foreground">Loan distribution by purpose</p>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Disbursement by Loan Purpose</CardTitle>
        <p className="text-sm text-muted-foreground">Loan distribution by purpose</p>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Amount (KES K)', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              formatter={(value: any) => {
                const numValue = Number(value);
                return [isNaN(numValue) ? "0" : formatCurrency(numValue * 1000), "Amount"];
              }}
            />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanPurposeChart;