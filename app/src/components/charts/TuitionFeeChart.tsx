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

  // Transform data for the chart - quartiles from COL AQ with ranges
  const annualFees = data?.annualFees || {};
  const q1 = annualFees.quartile1 || 0;
  const q2 = annualFees.quartile2 || 0;
  const q3 = annualFees.quartile3 || 0;
  const q4 = annualFees.quartile4 || 0;
  const minValue = annualFees.lowest || 0;

  const chartData = [
    { 
      quartile: "Quartile 1", 
      value: q1,
      min: minValue,
      max: q1,
      range: [minValue, q1]
    },
    { 
      quartile: "Quartile 2", 
      value: q2,
      min: q1,
      max: q2,
      range: [q1, q2]
    },
    { 
      quartile: "Quartile 3", 
      value: q3,
      min: q2,
      max: q3,
      range: [q2, q3]
    },
    { 
      quartile: "Quartile 4", 
      value: q4,
      min: q3,
      max: q4,
      range: [q3, q4]
    },
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
          <BarChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
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
              formatter={(value: number, name: string, props: any) => {
                if (name === "value") {
                  const range = props?.payload?.range || [];
                  const rangeStr = range.length === 2 && range[0] !== undefined && range[1] !== undefined
                    ? `Range: $${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(range[0])} - $${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(range[1])}`
                    : "";
                  return [
                    `$${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}${rangeStr ? ` (${rangeStr})` : ""}`,
                    "Quartile Value"
                  ];
                }
                return [value, name];
              }}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.quartile === label);
                if (item && item.range && Array.isArray(item.range) && item.range.length === 2 && item.range[0] !== undefined && item.range[1] !== undefined) {
                  return `${label} (Range: $${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(item.range[0])} - $${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(item.range[1])})`;
                }
                return label;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              label={(props: any) => {
                const { x, y, width, payload } = props;
                if (!payload || !payload.range) {
                  return <g />;
                }
                const range = payload.range || [];
                if (range.length === 2 && range[0] !== undefined && range[1] !== undefined) {
                  return (
                    <text 
                      x={x + width / 2} 
                      y={y - 5} 
                      fill="hsl(var(--muted-foreground))" 
                      fontSize={9} 
                      textAnchor="middle"
                    >
                      {`$${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(range[0])}-$${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(range[1])}`}
                    </text>
                  );
                }
                return <g />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TuitionFeeChart;
