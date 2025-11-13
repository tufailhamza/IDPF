import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface StudentReachCardProps {
  value?: string;
}

const StudentReachCard = ({ value = "104,231" }: StudentReachCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 flex flex-col justify-center p-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Student Reach</h3>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">Total students enrolled</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentReachCard;
