import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const RepaymentRateChart = () => {
  const repaymentRate = 98.2;
  const target = 97;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Repayment Rate</CardTitle>
        <p className="text-sm text-muted-foreground">Current vs {target}% target</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-success">{repaymentRate.toFixed(2)}%</div>
          <div className="text-sm text-muted-foreground">Repayment Rate</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Target</span>
            <span className="text-success font-medium">Above Target</span>
          </div>
          <Progress value={100} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Target: {target.toFixed(2)}% | Current: {repaymentRate.toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepaymentRateChart;