"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface DignitasTrainingCardProps {
  participationYes?: number;
  participationNo?: number;
}

const DignitasTrainingCard = ({ 
  participationYes = 72, 
  participationNo = 28 
}: DignitasTrainingCardProps) => {
  
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex flex-col h-full">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Dignitas School Training Participation</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Participants</span>
                <span className="text-2xl font-bold text-foreground">{participationYes}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Non-Participants</span>
                <span className="text-2xl font-bold text-foreground">{participationNo}%</span>
              </div>
            </div>
          </div>
          
          {/* Visual slider */}
          <div className="mt-auto pt-4">
            <div className="relative">
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${participationYes}%` }}
                />
                <div 
                  className="h-full bg-success transition-all" 
                  style={{ width: `${participationNo}%` }}
                />
              </div>
              <div 
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${participationYes}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-foreground -mt-3" />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Participants</span>
              <span className="text-xs text-muted-foreground">Non-Participants</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DignitasTrainingCard;
