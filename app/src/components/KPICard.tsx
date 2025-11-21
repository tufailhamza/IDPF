import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendType: "positive" | "negative" | "neutral";
}

const KPICard = ({ title, value, subtitle, trend, trendType }: KPICardProps) => {
  const getTrendIcon = () => {
    if (trendType === "positive") return <TrendingUp className="h-3 w-3" />;
    if (trendType === "negative") return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const getTrendColor = () => {
    if (trendType === "positive") return "text-success";
    if (trendType === "negative") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex flex-col h-full">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
          <div className="flex-1 flex flex-col justify-center items-center space-y-1">
            <div className="text-2xl font-bold text-foreground text-center">{value}</div>
            <div className="text-xs text-muted-foreground text-center">{subtitle}</div>
            {trend && (
              <div className={`flex items-center justify-center gap-1 text-xs ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trend}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;