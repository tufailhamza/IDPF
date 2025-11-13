import BudgetVarianceChart from "@/components/charts/BudgetVarianceChart";
import BurnRateChart from "@/components/charts/BurnRateChart";
import WaterfallChart from "@/components/charts/WaterfallChart";
import HeadcountVarianceCard from "@/components/charts/HeadcountVarianceCard";
import GrantDisbursementChart from "@/components/charts/GrantDisbursementChart";
import CostSplitChart from "@/components/charts/CostSplitChart";
import CashCoverageGauge from "@/components/charts/CashCoverageGauge";

const BoardReporting = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Board Reporting</h2>
        <p className="text-muted-foreground">Executive summary and strategic performance indicators</p>
      </div>

      {/* Top Row - Budget vs Actual and Burn Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetVarianceChart />
        <BurnRateChart />
      </div>

      {/* Second Row - Waterfall and Headcount */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterfallChart />
        <HeadcountVarianceCard />
      </div>

      {/* Third Row - Grant Disbursement */}
      <GrantDisbursementChart />

      {/* Fourth Row - Cost Split and Cash Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostSplitChart />
        <CashCoverageGauge />
      </div>
    </div>
  );
};

export default BoardReporting;