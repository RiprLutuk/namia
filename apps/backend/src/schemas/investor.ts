import { t, type Static } from "elysia";
const text = () => t.String({ maxLength: 10000 });
const texts = () => t.Array(text(), { maxItems: 100 });
const value = { title: text(), desc: text(), icon: text() };
const deal = {
  title: text(),
  borrower: text(),
  sector: text(),
  targetAmount: text(),
  fundedPercent: t.Number({ minimum: 0, maximum: 100 }),
  tenor: text(),
  yieldRate: text(),
  contract: text(),
  rating: text(),
};
export const InvestorInfoSchema = t.Object({
  heroBadge: t.Optional(text()),
  heroBadgeContract: t.Optional(text()),
  heroTitle: t.Optional(text()),
  heroHighlight: t.Optional(text()),
  heroLead: t.Optional(text()),
  heroReturnRange: t.Optional(text()),
  heroMinInvestment: t.Optional(text()),
  heroTkb90: t.Optional(text()),
  heroShariaCompliance: t.Optional(text()),
  liveDealsTicker: t.Optional(texts()),
  featuredDeal: t.Optional(
    t.Object({ ...deal, fundedAmount: text(), minInvest: text(), timeLeft: text() }),
  ),
  liveDeals: t.Optional(
    t.Array(t.Object({ ...deal, id: text(), status: text() }), { maxItems: 100 }),
  ),
  benchmarkRows: t.Optional(
    t.Array(
      t.Object({
        instrument: text(),
        yieldRange: text(),
        contractType: text(),
        riskProfile: text(),
        taxRate: text(),
        liquidity: text(),
        shariaStatus: text(),
        isHighlighted: t.Optional(t.Boolean()),
      }),
      { maxItems: 100 },
    ),
  ),
  lenderTiers: t.Optional(
    t.Array(
      t.Object({
        level: text(),
        name: text(),
        minCommitment: text(),
        badge: text(),
        color: text(),
        features: texts(),
        isPopular: t.Optional(t.Boolean()),
      }),
      { maxItems: 100 },
    ),
  ),
  sectorAllocations: t.Optional(
    t.Array(
      t.Object({
        sector: text(),
        percentage: t.Number({ minimum: 0, maximum: 100 }),
        desc: text(),
      }),
      { maxItems: 100 },
    ),
  ),
  officialFatwas: t.Optional(
    t.Array(t.Object({ number: text(), year: text(), title: text(), subject: text() }), {
      maxItems: 100,
    }),
  ),
  coreValues: t.Array(t.Object(value), { maxItems: 100 }),
  pillars: t.Array(t.Object({ ...value, badge: text() }), { maxItems: 100 }),
  steps: t.Array(t.Object({ ...value, step: t.Number(), num: text() }), { maxItems: 100 }),
  safetyMeasures: t.Array(t.Object({ ...value, badge: text() }), { maxItems: 100 }),
  ctaTitle: t.Optional(text()),
  ctaSubtitle: t.Optional(text()),
  ctaButtonText: t.Optional(text()),
  ctaButtonUrl: t.Optional(text()),
});
export type InvestorInfo = Static<typeof InvestorInfoSchema>;
