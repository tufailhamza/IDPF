"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LoanCycleChartProps {
  dataSource?: "premier" | "sasl";
}

const fetchLoanCycles = async (source: "premier" | "sasl" = "premier") => {
  const endpoint = source === "sasl" 
    ? "/api/sasl-loan-cycles"
    : "/api/loan-cycles";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch loan cycles for ${source}`);
  }
  return response.json();
};

const LoanCycleChart = ({ dataSource = "premier" }: LoanCycleChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["loan-cycles", dataSource],
    queryFn: () => fetchLoanCycles(dataSource),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Number of Loans Issued by Cycle</CardTitle>
          <p className="text-sm text-muted-foreground">Loan distribution across repayment cycles</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
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
          <CardTitle className="text-base">Number of Loans Issued by Cycle</CardTitle>
          <p className="text-sm text-muted-foreground">Loan distribution across repayment cycles</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-destructive">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Number of Loans Issued by Cycle</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="cycle" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Loan Cycle', position: 'insideBottom', offset: -5, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: 'Number of Loans', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip formatter={(value) => [`${value} loans`, "Loans Issued"]} />
            <Line 
              type="monotone" 
              dataKey="loans" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanCycleChart;
