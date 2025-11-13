import KPICard from "./KPICard";
import SchoolProprietorGenderCard from "@/components/charts/SchoolProprietorGenderCard";
import AnnualFeesCard from "@/components/charts/AnnualFeesCard";
import StudentReachCard from "@/components/charts/StudentReachCard";
import StudentGenderCard from "@/components/charts/StudentGenderCard";
import LoanDisbursementByYearChart from "@/components/charts/LoanDisbursementByYearChart";
import MonthlyLoanDisbursementChart from "@/components/charts/MonthlyLoanDisbursementChart";
import TopBranchesChart from "@/components/charts/TopBranchesChart";
import LoanPurposeChart from "@/components/charts/LoanPurposeChart";
import LoanCycleChart from "@/components/charts/LoanCycleChart";
import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import TuitionFeeChart from "@/components/charts/TuitionFeeChart";

const ProgramReporting = () => {
  return (
    <div className="space-y-[50px]">
      {/* Program Reach */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Program Reach</h2>
        <p className="text-muted-foreground">Program reach and demographic profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Number of Schools"
          value="1,847"
          subtitle="Schools financed through Rising Schools"
          trend=""
          trendType="neutral"
        />
        <SchoolProprietorGenderCard />
        <StudentGenderCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnualFeesCard 
          averageTuition="KES 38,500"
          lowestTuition="KES 8,000"
          maximumTuition="KES 95,000"
        />
        <StudentReachCard value="89,234" />
      </div>

      {/* 2025 YTD Loan Performance Data */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">2025 YTD Loan Performance Data</h2>
        <p className="text-muted-foreground">Current year financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Loan Portfolio Value"
          value="KES 325.42M"
          subtitle="Total capital deployed in 2025"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Total Loans Disbursed"
          value="2,156"
          subtitle="Number of loans issued YTD"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Average Loan Size"
          value="KES 150,940"
          subtitle="Mean loan amount per disbursement"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Schools Financed"
          value="1,847"
          subtitle="Unique schools receiving loans"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Active Branches"
          value="58"
          subtitle="Geographic lending locations"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Total Enrollment"
          value="89,234"
          subtitle="Students enrolled across all schools"
          trend=""
          trendType="neutral"
        />
      </div>

      {/* Annual Loan Portfolio Performance */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Annual Loan Portfolio Performance</h2>
        <p className="text-muted-foreground">Historical portfolio analysis and trends (2019-2025)</p>
      </div>

      <LoanDisbursementByYearChart />
      <MonthlyLoanDisbursementChart />
      <TopBranchesChart />
      <LoanPurposeChart />
      <LoanCycleChart />
      
      <GenderDistributionChart />
      <TuitionFeeChart />
    </div>
  );
};

export default ProgramReporting;