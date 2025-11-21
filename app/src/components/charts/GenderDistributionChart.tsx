"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="h-[280px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
});

interface GenderDistributionChartProps {
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

// Convert HSL to RGB for Plotly
const hslToRgb = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Primary blue: 221 61% 27%
const PRIMARY_BLUE = hslToRgb(221, 61, 27);
// Green for Boys: 142 76% 36%
const GREEN_BOYS = hslToRgb(142, 76, 36);

const GenderDistributionChart = ({ dataSource = "premier" }: GenderDistributionChartProps) => {
  const { data: baselineData, isLoading, error } = useQuery({
    queryKey: ["baseline-data", dataSource],
    queryFn: () => fetchBaselineData(dataSource),
  });

  // Transform data for the chart - Girls and Boys percentages
  const chartData = useMemo(() => {
    return baselineData?.studentReach ? [
      { name: "Girls", value: baselineData.studentReach.girls || 0 },
      { name: "Boys", value: baselineData.studentReach.boys || 0 },
    ] : [
      { name: "Girls", value: 52.3 },
      { name: "Boys", value: 47.7 },
    ];
  }, [baselineData]);

  // Prepare Plotly data - separate trace for each bar to show legend with colors
  const plotData = useMemo(() => {
    return chartData.map((item, index) => ({
      type: "bar",
      orientation: "h",
      x: [item.value],
      y: [item.name],
      marker: {
        color: index === 0 ? PRIMARY_BLUE : GREEN_BOYS,
      },
      text: [`${item.value.toFixed(2)}%`],
      textposition: "outside",
      hovertemplate: `<b>${item.name}</b><br>${item.value.toFixed(2)}%<extra></extra>`,
      name: item.name,
      showlegend: true,
    } as any));
  }, [chartData]);

  const plotLayout = useMemo(() => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    return {
      height: 280,
      margin: { l: 100, r: 20, t: 20, b: 60 },
      xaxis: {
        title: { text: "" },
        range: [0, maxValue * 1.2],
        tickformat: ".2f",
      },
      yaxis: {
        automargin: true,
      },
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: -0.3,
        xanchor: "center",
        x: 0.5,
      },
      barmode: "group" as const,
      hovermode: "closest" as const,
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    } as any;
  }, [chartData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student Gender Distribution</CardTitle>
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
          <CardTitle className="text-base">Student Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="h-[280px] flex items-center justify-center text-destructive">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Student Gender Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="w-full" style={{ height: "280px" }}>
          <Plot
            data={plotData}
            layout={plotLayout}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GenderDistributionChart;