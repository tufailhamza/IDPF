"use client";

import { useQuery } from "@tanstack/react-query";
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
import LoanRepaymentStatusCard from "@/components/charts/LoanRepaymentStatusCard";

const fetchSASLBaselineData = async () => {
  const response = await fetch("/api/sasl-baseline-data");
  if (!response.ok) {
    throw new Error("Failed to fetch SASL baseline data");
  }
  return response.json();
};

const fetchSASLYTDData = async () => {
  const response = await fetch("/api/sasl-ytd-loan-performance");
  if (!response.ok) {
    throw new Error("Failed to fetch SASL YTD loan performance data");
  }
  return response.json();
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(Math.round(num));
};

const formatCurrency = (num: number): string => {
  return `KES ${formatNumber(num)}`;
};

const formatCurrencyM = (num: number): string => {
  const millions = num / 1000000;
  return `KES ${millions.toFixed(2)}M`;
};

const ProgramReporting = () => {
  const { data: saslData, isLoading: baselineLoading, error: baselineError } = useQuery({
    queryKey: ["sasl-baseline-data"],
    queryFn: fetchSASLBaselineData,
  });

  const { data: saslYTDData, isLoading: ytdLoading, error: ytdError } = useQuery({
    queryKey: ["sasl-ytd-loan-performance"],
    queryFn: fetchSASLYTDData,
  });

  const isLoading = baselineLoading || ytdLoading;
  const hasError = baselineError || ytdError;

  if (isLoading) {
    return (
      <div className="space-y-[50px]">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Program Reach Profile</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading data...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-[50px]">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Program Reach Profile</h2>
        </div>
        <div className="text-center py-8 text-destructive">
          Error loading data: {baselineError instanceof Error ? baselineError.message : ytdError instanceof Error ? ytdError.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[50px]">
      {/* Program Reach */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Program Reach Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StudentReachCard value={saslData ? formatNumber(saslData.studentReach?.total || 0) : "89,234"} />
        <KPICard
          title="Total Number of Schools"
          value={saslData ? formatNumber(saslData.totalSchools) : "1,847"}
          subtitle="Schools financed through Rising Schools"
          trend=""
          trendType="neutral"
        />
        <SchoolProprietorGenderCard 
          femalePercent={saslData?.schoolProprietorGender?.female}
          malePercent={saslData?.schoolProprietorGender?.male}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnualFeesCard 
          averageTuition={saslData ? formatCurrency(saslData.annualFees?.average || 0) : "KES 38,500"}
          lowestTuition={saslData ? formatCurrency(saslData.annualFees?.lowest || 0) : "KES 8,000"}
          maximumTuition={saslData ? formatCurrency(saslData.annualFees?.maximum || 0) : "KES 95,000"}
        />
        <StudentGenderCard 
          femalePercent={saslData?.studentReach?.girls}
          malePercent={saslData?.studentReach?.boys}
        />
        <LoanRepaymentStatusCard />
      </div>

      {/* 2025 YTD Loan Performance Data */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">2025 YTD Loan Performance Data</h2>
       
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Loan Value Disbursed"
          value={saslYTDData ? formatCurrencyM(saslYTDData.totalPortfolioValue || 0) : "KES 325.42M"}
          subtitle="Total capital deployed in 2025"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Total Loans Disbursed"
          value={saslYTDData ? formatNumber(saslYTDData.totalLoans || 0) : "2,156"}
          subtitle="Number of loans issued YTD"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Average Loan Size"
          value={saslYTDData ? formatCurrency(saslYTDData.averageLoanSize || 0) : "KES 150,940"}
          subtitle="Mean loan amount per disbursement"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Schools Financed"
          value={saslYTDData ? formatNumber(saslYTDData.schoolsFinanced || 0) : "1,847"}
          subtitle="Unique schools receiving loans"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Active Branches"
          value={saslYTDData ? formatNumber(saslYTDData.activeBranches || 0) : "58"}
          subtitle="Geographic lending locations"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Total Enrollment"
          value={saslYTDData ? formatNumber(saslYTDData.totalEnrollment || 0) : "89,234"}
          subtitle="Students enrolled across all schools"
          trend=""
          trendType="neutral"
        />
      </div>

      {/* Annual Loan Portfolio Performance */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Annual Loan Portfolio Performance</h2>
     
      </div>

      <LoanDisbursementByYearChart dataSource="sasl" />
      <MonthlyLoanDisbursementChart />
      <TopBranchesChart dataSource="sasl" />
      <LoanPurposeChart dataSource="sasl" />
      <LoanCycleChart dataSource="sasl" />
      
      <GenderDistributionChart dataSource="sasl" />
      <TuitionFeeChart dataSource="sasl" />
    </div>
  );
};

export default ProgramReporting;