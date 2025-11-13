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
      <CardContent className="flex-1 flex flex-col justify-center p-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;