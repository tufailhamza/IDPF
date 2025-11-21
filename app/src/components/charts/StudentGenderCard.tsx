"use client";
import { Card, CardContent } from "@/components/ui/card";

interface StudentGenderCardProps {
  femalePercent?: number;
  malePercent?: number;
}

const StudentGenderCard = ({ 
  femalePercent = 52.0, 
  malePercent = 48.0 
}: StudentGenderCardProps) => {
  
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex flex-col h-full">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Student Gender Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Female Students</span>
                <span className="text-2xl font-bold text-foreground">{typeof femalePercent === 'number' ? femalePercent.toFixed(2) : femalePercent}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Male Students</span>
                <span className="text-2xl font-bold text-foreground">{typeof malePercent === 'number' ? malePercent.toFixed(2) : malePercent}%</span>
              </div>
            </div>
          </div>
          
          {/* Visual slider */}
          <div className="mt-auto pt-4">
            <div className="relative">
              <div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}>
                <div 
                  className="h-full transition-all flex-shrink-0" 
                  style={{ width: `${femalePercent}%`, backgroundColor: 'hsl(var(--primary))' }}
                />
                <div 
                  className="h-full transition-all flex-1" 
                  style={{ width: `${malePercent}%`, backgroundColor: 'hsl(142, 76%, 36%)' }}
                />
              </div>
              <div 
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${femalePercent}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-foreground -mt-3" />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Female Students</span>
              <span className="text-xs text-muted-foreground">Male Students</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentGenderCard;
