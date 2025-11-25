"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface LoanRepaymentStatusDoughnutChartProps {
  dataSource?: "premier" | "sasl";
}

const fetchRepaymentStatus = async (source: "premier" | "sasl" = "sasl") => {
  const endpoint = source === "premier" 
    ? "/api/premier-repayment-status"
    : "/api/sasl-repayment-status";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch repayment status");
  }
  return response.json();
};

const COLORS = {
  repayment: "hsl(var(--primary))",
  arrears: "hsl(var(--destructive))",
};

const LoanRepaymentStatusDoughnutChart = ({ dataSource = "sasl" }: LoanRepaymentStatusDoughnutChartProps) => {
  // Hardcoded values for Premier Credit
  const premierHardcodedData = {
    repaymentPercent: 99.30,
    arrearsPercent: 0.70,
    repayment: 0, // Amount not specified, using 0
    arrears: 0, // Amount not specified, using 0
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["repayment-status", dataSource],
    queryFn: () => fetchRepaymentStatus(dataSource),
    enabled: dataSource !== "premier", // Skip API call for Premier Credit
  });

  // Use hardcoded values for Premier Credit, API data for SASL
  const repaymentPercent = dataSource === "premier" 
    ? premierHardcodedData.repaymentPercent 
    : (data?.repaymentPercent ?? 0);
  const arrearsPercent = dataSource === "premier" 
    ? premierHardcodedData.arrearsPercent 
    : (data?.arrearsPercent ?? 0);
  const repaymentValue = dataSource === "premier" 
    ? premierHardcodedData.repayment 
    : (data?.repayment ?? 0);
  const arrearsValue = dataSource === "premier" 
    ? premierHardcodedData.arrears 
    : (data?.arrears ?? 0);

  // Ensure we have at least some data to display
  const total = repaymentValue + arrearsValue;
  // For Premier Credit, always show the chart with hardcoded percentages
  const chartData = (dataSource === "premier" || total > 0) ? [
    { name: "Repayment", value: repaymentPercent, amount: repaymentValue },
    { name: "Arrears", value: arrearsPercent, amount: arrearsValue },
  ] : [
    { name: "Repayment", value: 0, amount: 0 },
    { name: "Arrears", value: 0, amount: 0 },
  ];

  // Skip loading/error states for Premier Credit since we're using hardcoded data
  if (dataSource !== "premier" && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Repayment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dataSource !== "premier" && error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Repayment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-destructive">
            <div>Error loading chart data</div>
            <div className="text-xs text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message if no data (only for SASL, Premier Credit always has hardcoded data)
  if (dataSource !== "premier" && total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Repayment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No repayment data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Repayment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ value }) => `${Number(value).toFixed(1)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === "Repayment" ? COLORS.repayment : COLORS.arrears} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: any) => {
                const amount = props.payload?.amount || 0;
                return [
                  `${Number(value).toFixed(2)}% (KES ${new Intl.NumberFormat("en-US").format(amount)})`,
                  props.payload?.name || name
                ];
              }}
            />
            <Legend 
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
              height={50}
              iconType="circle"
              formatter={(value) => {
                const item = chartData.find(d => d.name === value);
                if (item) {
                  return `${value} (${item.value.toFixed(1)}%)`;
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanRepaymentStatusDoughnutChart;

