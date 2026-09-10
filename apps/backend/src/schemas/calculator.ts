import { t } from "elysia";

export const LoanCalculatorInputSchema = t.Object({
  amount: t.Numeric({ minimum: 1000000, maximum: 5000000000 }),
  tenorMonths: t.Numeric({ minimum: 1, maximum: 120 }),
  marginAnnualPercent: t.Numeric({ minimum: 0, maximum: 100 }), // Margin pertahun (misal 8%)
  contractType: t.Optional(t.Union([
    t.Literal("Murabahah"),
    t.Literal("Ijarah"),
    t.Literal("Musyarakah"),
    t.Literal("Qardh")
  ]))
});

export const InvestmentCalculatorInputSchema = t.Object({
  initialAmount: t.Numeric({ minimum: 100000 }),
  monthlyContribution: t.Optional(t.Numeric({ minimum: 0 })),
  projectedAnnualYieldPercent: t.Numeric({ minimum: 1, maximum: 50 }),
  durationYears: t.Numeric({ minimum: 1, maximum: 30 }),
  nisbahInvestorPercent: t.Optional(t.Numeric({ minimum: 10, maximum: 90 })) // nisbah bagi hasil, cth 70% investor
});

export const CreditScoreInputSchema = t.Object({
  monthlyIncome: t.Numeric({ minimum: 1000000 }),
  monthlyExpenses: t.Numeric({ minimum: 0 }),
  existingLoanInstallment: t.Numeric({ minimum: 0 }),
  employmentType: t.Union([
    t.Literal("permanent_employee"),
    t.Literal("contract_employee"),
    t.Literal("entrepreneur"),
    t.Literal("freelancer")
  ]),
  employmentDurationYears: t.Numeric({ minimum: 0 }),
  creditHistory: t.Union([
    t.Literal("excellent"),
    t.Literal("good"),
    t.Literal("fair"),
    t.Literal("no_history")
  ])
});
