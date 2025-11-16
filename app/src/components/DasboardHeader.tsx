import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">IDP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">IDP Foundation</h1>
              <p className="text-sm text-muted-foreground">Program Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] text-muted-foreground">
              <span className="font-bold">Last Updated:</span> 12:15 AM CST December 15, 2025
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;