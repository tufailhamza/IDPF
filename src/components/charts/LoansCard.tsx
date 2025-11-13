import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

const LoansCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Loans Distributed
        </CardTitle>
        <p className="text-sm text-muted-foreground">Financial leverage</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold text-foreground">$4.2M</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Loans</span>
              <span className="font-medium">8,947</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Loan Size</span>
              <span className="font-medium">$469</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <TrendingUp className="h-4 w-4" />
            <span>+18% vs 2023</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoansCard;