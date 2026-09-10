import { Elysia } from "elysia";
import {
  LoanCalculatorInputSchema,
  InvestmentCalculatorInputSchema,
  CreditScoreInputSchema
} from "../schemas/calculator";

export const calculatorController = new Elysia({ prefix: "/api/calculator" })
  // 1. Sharia Loan / Installment Calculator (Murabahah, Ijarah, Qardh)
  .post("/loan", ({ body }) => {
    const principal = Number(body.amount);
    const tenorMonths = Number(body.tenorMonths);
    const marginAnnual = Number(body.marginAnnualPercent);
    const contractType = body.contractType || "Murabahah";

    // For Murabahah: Total Margin = Principal * (MarginAnnual / 100) * (tenorMonths / 12)
    // Total Selling Price = Principal + Total Margin
    // Monthly Installment = Total Selling Price / tenorMonths
    const tenorYears = tenorMonths / 12;
    const totalMargin = principal * (marginAnnual / 100) * tenorYears;
    const totalPayable = principal + totalMargin;
    const monthlyInstallment = Math.round(totalPayable / tenorMonths);

    // Generate month-by-month amortization schedule summary
    const schedule = [];
    let remainingPrincipal = principal;
    const principalPerMonth = Math.round(principal / tenorMonths);
    const marginPerMonth = Math.round(totalMargin / tenorMonths);

    for (let month = 1; month <= Math.min(tenorMonths, 12); month++) {
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPerMonth);
      schedule.push({
        month,
        installment: monthlyInstallment,
        principalPortion: principalPerMonth,
        marginPortion: marginPerMonth,
        remainingBalance: remainingPrincipal
      });
    }

    return {
      success: true,
      data: {
        principal,
        tenorMonths,
        marginAnnualPercent: marginAnnual,
        contractType,
        totalMargin: Math.round(totalMargin),
        totalPayable: Math.round(totalPayable),
        monthlyInstallment,
        previewSchedule: schedule
      }
    };
  }, {
    body: LoanCalculatorInputSchema,
    detail: {
      tags: ["Calculator"],
      summary: "Simulate Sharia loan installments (Murabahah/Ijarah)"
    }
  })

  // 2. Investment & Compound ROI Calculator (Mudharabah/Musyarakah)
  .post("/investment", ({ body }) => {
    const initialAmount = Number(body.initialAmount);
    const monthlyContribution = Number(body.monthlyContribution || 0);
    const annualYieldPercent = Number(body.projectedAnnualYieldPercent);
    const durationYears = Number(body.durationYears);
    const nisbahInvestorPercent = Number(body.nisbahInvestorPercent || 70);

    // Effective yield after Nisbah (profit sharing ratio)
    const effectiveAnnualRate = (annualYieldPercent * (nisbahInvestorPercent / 100)) / 100;
    const monthlyRate = effectiveAnnualRate / 12;
    const totalMonths = durationYears * 12;

    let totalBalance = initialAmount;
    let totalInvested = initialAmount;
    const annualBreakdown = [];

    for (let month = 1; month <= totalMonths; month++) {
      totalBalance = (totalBalance + monthlyContribution) * (1 + monthlyRate);
      totalInvested += monthlyContribution;

      if (month % 12 === 0) {
        const year = month / 12;
        annualBreakdown.push({
          year,
          totalInvested: Math.round(totalInvested),
          estimatedProfit: Math.round(totalBalance - totalInvested),
          portfolioValue: Math.round(totalBalance)
        });
      }
    }

    const estimatedProfit = Math.round(totalBalance - totalInvested);

    return {
      success: true,
      data: {
        initialAmount,
        monthlyContribution,
        projectedAnnualYieldPercent: annualYieldPercent,
        nisbahInvestorPercent,
        effectiveAnnualYieldPercent: Number((effectiveAnnualRate * 100).toFixed(2)),
        durationYears,
        totalInvested: Math.round(totalInvested),
        estimatedProfit,
        finalPortfolioValue: Math.round(totalBalance),
        annualBreakdown
      }
    };
  }, {
    body: InvestmentCalculatorInputSchema,
    detail: {
      tags: ["Calculator"],
      summary: "Simulate Sharia investment growth and Mudharabah yield"
    }
  })

  // 3. Credit Score & Financial Health Estimator
  .post("/credit-score", ({ body }) => {
    const income = Number(body.monthlyIncome);
    const expenses = Number(body.monthlyExpenses);
    const existingDebt = Number(body.existingLoanInstallment);
    const totalCommitments = expenses + existingDebt;

    // Debt Service Ratio (DSR) = Existing Debt / Income * 100
    const dsr = income > 0 ? (existingDebt / income) * 100 : 100;
    // Disposable Income
    const disposableIncome = Math.max(0, income - totalCommitments);

    // Scoring algorithm (Scale 300 - 850)
    let score = 550;

    // 1. DSR impact (+/- 150 pts)
    if (dsr < 20) score += 140;
    else if (dsr < 30) score += 90;
    else if (dsr < 40) score += 40;
    else if (dsr > 50) score -= 100;

    // 2. Employment stability (+/- 80 pts)
    if (body.employmentType === "permanent_employee") score += 60;
    else if (body.employmentType === "entrepreneur") score += 45;
    else if (body.employmentType === "contract_employee") score += 20;

    if (Number(body.employmentDurationYears) >= 3) score += 40;
    else if (Number(body.employmentDurationYears) >= 1) score += 20;

    // 3. Credit history (+/- 100 pts)
    if (body.creditHistory === "excellent") score += 80;
    else if (body.creditHistory === "good") score += 50;
    else if (body.creditHistory === "no_history") score += 10;
    else score -= 80;

    // Clamp score
    score = Math.min(850, Math.max(300, score));

    let tier: "Sangat Sehat" | "Sehat" | "Cukup" | "Perlu Perhatian";
    let maxRecommendedFinancing = 0;

    if (score >= 750) {
      tier = "Sangat Sehat";
      maxRecommendedFinancing = Math.round(disposableIncome * 0.45 * 24); // max 24x 45% disposable
    } else if (score >= 670) {
      tier = "Sehat";
      maxRecommendedFinancing = Math.round(disposableIncome * 0.35 * 18);
    } else if (score >= 580) {
      tier = "Cukup";
      maxRecommendedFinancing = Math.round(disposableIncome * 0.25 * 12);
    } else {
      tier = "Perlu Perhatian";
      maxRecommendedFinancing = Math.round(disposableIncome * 0.15 * 6);
    }

    return {
      success: true,
      data: {
        score,
        tier,
        debtServiceRatio: Number(dsr.toFixed(1)),
        disposableIncome,
        maxRecommendedFinancing,
        insights: [
          dsr < 30 ? "Rasio beban hutang Anda sangat sehat (di bawah 30%)." : "Pertimbangkan melunasi kewajiban berjalan untuk meningkatkan kapasitas pembiayaan.",
          score >= 670 ? "Peluang persetujuan pembiayaan syariah mitra sangat tinggi." : "Tingkatkan masa kerja atau tabungan darurat untuk memperkuat profil kredit."
        ]
      }
    };
  }, {
    body: CreditScoreInputSchema,
    detail: {
      tags: ["Calculator"],
      summary: "Estimate creditworthiness score and financing capacity"
    }
  });
