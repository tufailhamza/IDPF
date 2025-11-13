import KPICard from "./KPICard";
import SchoolProprietorGenderCard from "@/components/charts/SchoolProprietorGenderCard";
import DignitasTrainingCard from "@/components/charts/DignitasTrainingCard";
import StudentGenderCard from "@/components/charts/StudentGenderCard";
import AnnualFeesCard from "@/components/charts/AnnualFeesCard";
import StudentReachCard from "@/components/charts/StudentReachCard";
import LoanDisbursementByYearChart from "@/components/charts/LoanDisbursementByYearChart";
import MonthlyLoanDisbursementChart from "@/components/charts/MonthlyLoanDisbursementChart";
import KenyaBranchPerformanceChart from "@/components/charts/KenyaBranchPerformanceChart";
import KenyaLoanPurposeChart from "@/components/charts/KenyaLoanPurposeChart";
import LoanCycleChart from "@/components/charts/LoanCycleChart";
import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import TuitionFeeChart from "@/components/charts/TuitionFeeChart";

const AnnualReport = () => {
  return (
    <div className="space-y-[50px]">
      {/* Program Reach */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Program Reach</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Number of Schools"
          value="2,863"
          subtitle="Schools financed through Premier Credit"
          trend=""
          trendType="neutral"
        />
        <SchoolProprietorGenderCard />
        <DignitasTrainingCard />
        <StudentGenderCard />
        <AnnualFeesCard 
          averageTuition="KES 45,200"
          lowestTuition="KES 12,000"
          maximumTuition="KES 125,000"
        />
        <StudentReachCard value="104,231" />
      </div>

      {/* 2025 YTD Loan Performance Data */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">2025 YTD Loan Performance Data</h2>
        <p className="text-muted-foreground">Current year financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Loan Portfolio Value"
          value="KES 488.65M"
          subtitle="Total capital deployed in 2025"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Total Loans Disbursed"
          value="3,484"
          subtitle="Number of loans issued YTD"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Average Loan Size"
          value="KES 140,254"
          subtitle="Mean loan amount per disbursement"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Schools Financed"
          value="2,863"
          subtitle="Unique schools receiving loans"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Active Branches"
          value="72"
          subtitle="Geographic lending locations"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Owner Gender Diversity"
          value="64.0%"
          subtitle="Female proprietors"
          trend=""
          trendType="positive"
        />
      </div>

      {/* Loan Performance Analytics */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Loan Performance Analytics</h2>
        <p className="text-muted-foreground">Detailed portfolio analysis and trends</p>
      </div>

      <LoanDisbursementByYearChart />
      <MonthlyLoanDisbursementChart />
      <KenyaBranchPerformanceChart />
      <KenyaLoanPurposeChart />
      <LoanCycleChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderDistributionChart />
        <TuitionFeeChart />
      </div>
    </div>
  );
};

export default AnnualReport;