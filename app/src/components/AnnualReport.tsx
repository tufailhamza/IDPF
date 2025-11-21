"use client";

import { useQuery } from "@tanstack/react-query";
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

const fetchBaselineData = async () => {
  const response = await fetch("/api/baseline-data");
  if (!response.ok) {
    throw new Error("Failed to fetch baseline data");
  }
  return response.json();
};

const fetchYTDData = async () => {
  const response = await fetch("/api/ytd-loan-performance");
  if (!response.ok) {
    throw new Error("Failed to fetch YTD loan performance data");
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

const AnnualReport = () => {
  const { data: baselineData, isLoading: baselineLoading, error: baselineError } = useQuery({
    queryKey: ["baseline-data"],
    queryFn: fetchBaselineData,
  });

  const { data: ytdData, isLoading: ytdLoading, error: ytdError } = useQuery({
    queryKey: ["ytd-loan-performance"],
    queryFn: fetchYTDData,
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
        <KPICard
          title="Total Number of Schools"
          value={baselineData ? formatNumber(baselineData.totalSchools) : "2,863"}
          subtitle="Schools financed through Premier Credit"
          trend=""
          trendType="neutral"
        />
        <SchoolProprietorGenderCard 
          femalePercent={baselineData?.schoolProprietorGender?.female}
          malePercent={baselineData?.schoolProprietorGender?.male}
        />
        <DignitasTrainingCard 
          participationYes={baselineData?.dignitasTraining?.yes}
          participationNo={baselineData?.dignitasTraining?.no}
        />
        <StudentGenderCard 
          femalePercent={baselineData?.studentReach?.girls}
          malePercent={baselineData?.studentReach?.boys}
        />
        <AnnualFeesCard 
          averageTuition={baselineData ? formatCurrency(baselineData.annualFees?.average || 0) : "KES 45,200"}
          lowestTuition={baselineData ? formatCurrency(baselineData.annualFees?.lowest || 0) : "KES 12,000"}
          maximumTuition={baselineData ? formatCurrency(baselineData.annualFees?.maximum || 0) : "KES 125,000"}
        />
        <StudentReachCard value={baselineData ? formatNumber(baselineData.studentReach?.total || 0) : "104,231"} />
      </div>

      {/* 2025 YTD Loan Performance Data */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">2025 YTD Loan Performance Data</h2>
        <p className="text-muted-foreground">Current year financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Loan Value Disbursed"
          value={ytdData ? formatCurrencyM(ytdData.totalPortfolioValue || 0) : "KES 488.65M"}
          subtitle="Total capital deployed in 2025"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Total Loans Disbursed"
          value={ytdData ? formatNumber(ytdData.totalLoans || 0) : "3,484"}
          subtitle="Number of loans issued YTD"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Average Loan Size"
          value={ytdData ? formatCurrency(ytdData.averageLoanSize || 0) : "KES 140,254"}
          subtitle="Mean loan amount per disbursement"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Schools Financed"
          value={ytdData ? formatNumber(ytdData.schoolsFinanced || 0) : "2,863"}
          subtitle="Unique schools receiving loans"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Active Branches"
          value={ytdData ? formatNumber(ytdData.activeBranches || 0) : "72"}
          subtitle="Geographic lending locations"
          trend=""
          trendType="neutral"
        />
        <KPICard
          title="Owner Gender Diversity"
          value={ytdData ? `${(ytdData.ownerGenderDiversity?.female || 0).toFixed(2)}%` : "64.00%"}
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