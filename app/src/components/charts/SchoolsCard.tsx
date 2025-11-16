import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, TrendingUp } from "lucide-react";

const SchoolsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5 text-primary" />
          Schools Supported
        </CardTitle>
        <p className="text-sm text-muted-foreground">Breadth of intervention</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold text-foreground">2,547</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Primary Schools</span>
              <span className="font-medium">1,823</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Secondary Schools</span>
              <span className="font-medium">724</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <TrendingUp className="h-4 w-4" />
            <span>+12% vs 2023</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolsCard;