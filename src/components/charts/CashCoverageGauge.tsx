import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const CashCoverageGauge = () => {
  const monthsOfRunway = 18.5;
  const maxMonths = 24;
  const percentage = (monthsOfRunway / maxMonths) * 100;

  const getStatus = (months: number) => {
    if (months >= 18) return { status: 'Excellent', color: 'success', icon: CheckCircle };
    if (months >= 12) return { status: 'Good', color: 'warning', icon: Clock };
    return { status: 'Critical', color: 'destructive', icon: AlertTriangle };
  };

  const { status, color, icon: StatusIcon } = getStatus(monthsOfRunway);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Coverage Ratio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">
                {monthsOfRunway} months
              </div>
              <p className="text-sm text-muted-foreground">Runway at current burn rate</p>
            </div>

            <div className="space-y-3">
              <Progress 
                value={percentage} 
                className="h-6"
              />
              <div className="flex items-center justify-center gap-2">
                <StatusIcon className={`h-4 w-4 text-${color}`} />
                <Badge 
                  variant={color === 'success' ? 'default' : 'secondary'}
                  className={color === 'success' ? 'bg-success text-success-foreground' : 
                            color === 'warning' ? 'bg-warning text-warning-foreground' : 
                            'bg-destructive text-destructive-foreground'}
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="w-4 h-4 rounded-full bg-destructive mx-auto"></div>
              <p className="text-xs text-muted-foreground">Critical</p>
              <p className="text-xs font-medium">&lt;12 months</p>
            </div>
            <div className="space-y-1">
              <div className="w-4 h-4 rounded-full bg-warning mx-auto"></div>
              <p className="text-xs text-muted-foreground">Caution</p>
              <p className="text-xs font-medium">12-18 months</p>
            </div>
            <div className="space-y-1">
              <div className="w-4 h-4 rounded-full bg-success mx-auto"></div>
              <p className="text-xs text-muted-foreground">Healthy</p>
              <p className="text-xs font-medium">&gt;18 months</p>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current monthly burn:</span>
              <span className="font-medium">$847K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available cash:</span>
              <span className="font-medium">$15.7M</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashCoverageGauge;