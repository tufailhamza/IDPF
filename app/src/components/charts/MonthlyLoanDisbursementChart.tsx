"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MonthlyLoanDisbursementChartProps {
  dataSource?: "premier" | "sasl";
}

// Hardcoded data from IDPRSP Loan Disbursement Summary (SASL)
// Column G = Loan Count (Monthly Volume)
// Column H = Loan Value Committed (Monthly Value in GHS)
const saslMonthlyDisbursementData = [
  // 2022
  { month: "January 2022", year: "2022", monthlyVolume: 5, monthlyValue: 280000 },
  { month: "February 2022", year: "2022", monthlyVolume: 4, monthlyValue: 170000 },
  { month: "March 2022", year: "2022", monthlyVolume: 8, monthlyValue: 410000 },
  { month: "April 2022", year: "2022", monthlyVolume: 8, monthlyValue: 441000 },
  { month: "May 2022", year: "2022", monthlyVolume: 13, monthlyValue: 753000 },
  { month: "June 2022", year: "2022", monthlyVolume: 9, monthlyValue: 570000 },
  { month: "July 2022", year: "2022", monthlyVolume: 7, monthlyValue: 275000 },
  { month: "August 2022", year: "2022", monthlyVolume: 15, monthlyValue: 933000 },
  { month: "September 2022", year: "2022", monthlyVolume: 15, monthlyValue: 729000 },
  { month: "October 2022", year: "2022", monthlyVolume: 3, monthlyValue: 235000 },
  { month: "November 2022", year: "2022", monthlyVolume: 12, monthlyValue: 894000 },
  { month: "December 2022", year: "2022", monthlyVolume: 11, monthlyValue: 850000 },
  // 2023
  { month: "January 2023", year: "2023", monthlyVolume: 6, monthlyValue: 375000 },
  { month: "February 2023", year: "2023", monthlyVolume: 3, monthlyValue: 70000 },
  { month: "March 2023", year: "2023", monthlyVolume: 5, monthlyValue: 370000 },
  { month: "April 2023", year: "2023", monthlyVolume: 3, monthlyValue: 650000 },
  { month: "May 2023", year: "2023", monthlyVolume: 5, monthlyValue: 315000 },
  { month: "June 2023", year: "2023", monthlyVolume: 13, monthlyValue: 771000 },
  { month: "July 2023", year: "2023", monthlyVolume: 7, monthlyValue: 410000 },
  { month: "August 2023", year: "2023", monthlyVolume: 6, monthlyValue: 338000 },
  { month: "September 2023", year: "2023", monthlyVolume: 9, monthlyValue: 620000 },
  { month: "October 2023", year: "2023", monthlyVolume: 12, monthlyValue: 702000 },
  { month: "November 2023", year: "2023", monthlyVolume: 12, monthlyValue: 1651000 },
  { month: "December 2023", year: "2023", monthlyVolume: 9, monthlyValue: 800000 },
  // 2024
  { month: "January 2024", year: "2024", monthlyVolume: 10, monthlyValue: 711000 },
  { month: "February 2024", year: "2024", monthlyVolume: 5, monthlyValue: 338000 },
  { month: "March 2024", year: "2024", monthlyVolume: 13, monthlyValue: 1980000 },
  { month: "April 2024", year: "2024", monthlyVolume: 8, monthlyValue: 1095000 },
  { month: "May 2024", year: "2024", monthlyVolume: 7, monthlyValue: 825000 },
  { month: "June 2024", year: "2024", monthlyVolume: 7, monthlyValue: 950000 },
  { month: "July 2024", year: "2024", monthlyVolume: 12, monthlyValue: 1425000 },
  { month: "August 2024", year: "2024", monthlyVolume: 15, monthlyValue: 1570000 },
  { month: "September 2024", year: "2024", monthlyVolume: 6, monthlyValue: 1362000 },
  { month: "October 2024", year: "2024", monthlyVolume: 5, monthlyValue: 362000 },
  { month: "November 2024", year: "2024", monthlyVolume: 5, monthlyValue: 270000 },
  { month: "December 2024", year: "2024", monthlyVolume: 8, monthlyValue: 1372000 },
  // 2025
  { month: "January 2025", year: "2025", monthlyVolume: 6, monthlyValue: 380000 },
  { month: "February 2025", year: "2025", monthlyVolume: 12, monthlyValue: 2555000 },
  { month: "March 2025", year: "2025", monthlyVolume: 15, monthlyValue: 3370000 },
  { month: "April 2025", year: "2025", monthlyVolume: 3, monthlyValue: 250000 },
  { month: "May 2025", year: "2025", monthlyVolume: 9, monthlyValue: 1640000 },
  { month: "June 2025", year: "2025", monthlyVolume: 10, monthlyValue: 1570000 },
  { month: "July 2025", year: "2025", monthlyVolume: 6, monthlyValue: 850000 },
  { month: "August 2025", year: "2025", monthlyVolume: 17, monthlyValue: 2582000 },
  { month: "September 2025", year: "2025", monthlyVolume: 10, monthlyValue: 1595000 },
];

// Hardcoded data from Ongoza Loan Disbursement Summary (Premier Credit)
// Column G = Loan Count (Monthly Volume)
// Column H = Loan Value Committed (Monthly Value in KES)
const premierMonthlyDisbursementData = [
  // 2022 - Only Sep, Oct, Nov, Dec have data
  { month: "January 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "February 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "March 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "April 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "May 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "June 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "July 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "August 2022", year: "2022", monthlyVolume: 0, monthlyValue: 0 },
  { month: "September 2022", year: "2022", monthlyVolume: 10, monthlyValue: 2068500 },
  { month: "October 2022", year: "2022", monthlyVolume: 21, monthlyValue: 3911250 },
  { month: "November 2022", year: "2022", monthlyVolume: 47, monthlyValue: 6987750 },
  { month: "December 2022", year: "2022", monthlyVolume: 37, monthlyValue: 5181750 },
  // 2023
  { month: "January 2023", year: "2023", monthlyVolume: 41, monthlyValue: 5124000 },
  { month: "February 2023", year: "2023", monthlyVolume: 47, monthlyValue: 6494250 },
  { month: "March 2023", year: "2023", monthlyVolume: 79, monthlyValue: 10956750 },
  { month: "April 2023", year: "2023", monthlyVolume: 88, monthlyValue: 11151000 },
  { month: "May 2023", year: "2023", monthlyVolume: 78, monthlyValue: 9528750 },
  { month: "June 2023", year: "2023", monthlyVolume: 67, monthlyValue: 7297500 },
  { month: "July 2023", year: "2023", monthlyVolume: 105, monthlyValue: 13671000 },
  { month: "August 2023", year: "2023", monthlyVolume: 79, monthlyValue: 11460750 },
  { month: "September 2023", year: "2023", monthlyVolume: 50, monthlyValue: 7549500 },
  { month: "October 2023", year: "2023", monthlyVolume: 88, monthlyValue: 12411000 },
  { month: "November 2023", year: "2023", monthlyVolume: 139, monthlyValue: 18894750 },
  { month: "December 2023", year: "2023", monthlyVolume: 33, monthlyValue: 4950750 },
  // 2024
  { month: "January 2024", year: "2024", monthlyVolume: 57, monthlyValue: 7155750 },
  { month: "February 2024", year: "2024", monthlyVolume: 92, monthlyValue: 13198500 },
  { month: "March 2024", year: "2024", monthlyVolume: 107, monthlyValue: 13891500 },
  { month: "April 2024", year: "2024", monthlyVolume: 103, monthlyValue: 14616000 },
  { month: "May 2024", year: "2024", monthlyVolume: 84, monthlyValue: 10742550 },
  { month: "June 2024", year: "2024", monthlyVolume: 121, monthlyValue: 17923500 },
  { month: "July 2024", year: "2024", monthlyVolume: 181, monthlyValue: 22250550 },
  { month: "August 2024", year: "2024", monthlyVolume: 135, monthlyValue: 21192355 },
  { month: "September 2024", year: "2024", monthlyVolume: 81, monthlyValue: 11443950 },
  { month: "October 2024", year: "2024", monthlyVolume: 184, monthlyValue: 28255500 },
  { month: "November 2024", year: "2024", monthlyVolume: 229, monthlyValue: 38251500 },
  { month: "December 2024", year: "2024", monthlyVolume: 55, monthlyValue: 8657250 },
  // 2025
  { month: "January 2025", year: "2025", monthlyVolume: 100, monthlyValue: 12026000 },
  { month: "February 2025", year: "2025", monthlyVolume: 121, monthlyValue: 14325000 },
  { month: "March 2025", year: "2025", monthlyVolume: 210, monthlyValue: 29525000 },
  { month: "April 2025", year: "2025", monthlyVolume: 163, monthlyValue: 22086000 },
  { month: "May 2025", year: "2025", monthlyVolume: 125, monthlyValue: 18441000 },
  { month: "June 2025", year: "2025", monthlyVolume: 139, monthlyValue: 21100000 },
  { month: "July 2025", year: "2025", monthlyVolume: 104, monthlyValue: 13856000 },
  { month: "August 2025", year: "2025", monthlyVolume: 115, monthlyValue: 18050000 },
  { month: "September 2025", year: "2025", monthlyVolume: 68, monthlyValue: 10460000 },
];

const MonthlyLoanDisbursementChart = ({ dataSource = "sasl" }: MonthlyLoanDisbursementChartProps) => {
  // Select the appropriate data based on dataSource
  const monthlyDisbursementData = dataSource === "premier" ? premierMonthlyDisbursementData : saslMonthlyDisbursementData;
  const currency = dataSource === "premier" ? "KES" : "GHS";
  
  // Transform data for the chart
  // monthlyValue = Loan Value Committed (from column H)
  // monthlyVolume = Loan Count (from column G)
  const chartData = monthlyDisbursementData.map((item) => ({
    month: item.month,
    year: item.year,
    loanCount: item.monthlyVolume, // Loan Count (Monthly Volume) - from column G
    commitment: item.monthlyValue / 1000000, // Loan Value Committed (converted to millions for display) - from column H
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Loan Disbursement Trends (2022-25)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 50, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="month" 
              xAxisId="month"
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 'bold' }}
              height={20}
              interval={0}
              axisLine={false}
              tickLine={false}
              offset={70}
              tickFormatter={(value, index) => {
                // Show year only at the first month of each year
                if (index === 0 || chartData[index - 1]?.year !== chartData[index]?.year) {
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
              label={{ value: "Loan Value Committed", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))", offset: 15 }}
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                if (name === "loanCount") {
                  return [value, "Monthly Volume"];
                } else if (name === "commitment") {
                  return [`${value.toFixed(2)}M ${currency}`, "Loan Value Committed"];
                }
                return [value, name];
              }}
            />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
              height={50}
              formatter={(value) => {
                if (value === "loanCount") return "Monthly Volume";
                if (value === "commitment") return "Loan Value Committed";
                return value;
              }}
            />
            <Bar 
              dataKey="loanCount" 
              fill="hsl(var(--primary-light))" 
              name="Monthly Volume"
              xAxisId="month"
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="commitment" 
              stroke="hsl(var(--warning))" 
              name="Loan Value Committed"
              xAxisId="month"
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
