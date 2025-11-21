"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

const fetchRepaymentStatus = async () => {
  const response = await fetch("/api/sasl-repayment-status");
  if (!response.ok) {
    throw new Error("Failed to fetch repayment status");
  }
  return response.json();
};

const LoanRepaymentStatusCard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["repayment-status"],
    queryFn: fetchRepaymentStatus,
  });

  const repaymentPercent = data?.repaymentPercent || 72.5;
  const arrearsPercent = data?.arrearsPercent || 27.5;

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardContent className="flex-1 flex flex-col p-6">
          <div className="flex flex-col h-full">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Loan Repayment Status</h3>
              <div className="text-center py-8 text-muted-foreground">Loading data...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardContent className="flex-1 flex flex-col p-6">
          <div className="flex flex-col h-full">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Loan Repayment Status</h3>
              <div className="text-center py-8 text-destructive">Error loading data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex flex-col h-full">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Loan Repayment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Repayment</span>
                <span className="text-2xl font-bold text-foreground">{typeof repaymentPercent === 'number' ? repaymentPercent.toFixed(2) : repaymentPercent}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Arrears</span>
                <span className="text-2xl font-bold text-foreground">{typeof arrearsPercent === 'number' ? arrearsPercent.toFixed(2) : arrearsPercent}%</span>
              </div>
            </div>
          </div>
          
          {/* Visual slider */}
          <div className="mt-auto pt-4">
            <div className="relative">
              <div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}>
                <div 
                  className="h-full transition-all flex-shrink-0" 
                  style={{ width: `${repaymentPercent}%`, backgroundColor: 'hsl(var(--primary))' }}
                />
                <div 
                  className="h-full transition-all flex-1" 
                  style={{ width: `${arrearsPercent}%`, backgroundColor: 'hsl(142, 76%, 36%)' }}
                />
              </div>
              <div 
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${repaymentPercent}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-foreground -mt-3" />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Repayment</span>
              <span className="text-xs text-muted-foreground">Arrears</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanRepaymentStatusCard;

