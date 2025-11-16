import { Card, CardContent } from "@/components/ui/card";

interface AnnualFeesCardProps {
  averageTuition: string;
  lowestTuition: string;
  maximumTuition: string;
}

const AnnualFeesCard = ({ 
  averageTuition = "KES 45,200", 
  lowestTuition = "KES 12,000", 
  maximumTuition = "KES 125,000" 
}: AnnualFeesCardProps) => {
  // Extract numeric values and convert to K format
  const extractNumber = (value: string) => parseInt(value.replace(/[^\d]/g, ''));
  const lowest = extractNumber(lowestTuition);
  const maximum = extractNumber(maximumTuition);
  const average = extractNumber(averageTuition);
  
  // Round to thousands and format as K
  const formatToK = (value: number) => `${Math.round(value / 1000)}K KES`;
  const lowestFormatted = formatToK(lowest);
  const maximumFormatted = formatToK(maximum);
  const averageFormatted = formatToK(average);
  
  // Calculate position percentage for the average marker
  const lowestRounded = Math.round(lowest / 1000) * 1000;
  const maximumRounded = Math.round(maximum / 1000) * 1000;
  const averageRounded = Math.round(average / 1000) * 1000;
  const averagePosition = ((averageRounded - lowestRounded) / (maximumRounded - lowestRounded)) * 100;
  
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex flex-col h-full">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Annual Tuition Fees</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Average</span>
                <span className="text-2xl font-bold text-foreground">{averageFormatted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Lowest</span>
                <span className="text-2xl font-bold text-foreground">{lowestFormatted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Maximum</span>
                <span className="text-2xl font-bold text-foreground">{maximumFormatted}</span>
              </div>
            </div>
          </div>
          
          {/* Visual slider */}
          <div className="mt-auto pt-4">
            <div className="relative">
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${averagePosition}%` }}
                />
                <div 
                  className="h-full bg-success transition-all" 
                  style={{ width: `${100 - averagePosition}%` }}
                />
              </div>
              <div 
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${averagePosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-foreground -mt-3" />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">{lowestFormatted}</span>
              <span className="text-xs text-muted-foreground">Average</span>
              <span className="text-xs text-muted-foreground">{maximumFormatted}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnualFeesCard;
