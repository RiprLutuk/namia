import { t } from "elysia";

// --- TypeBox Schemas ---
export const ProductFilterSchema = t.Object({
  category: t.Optional(t.String()),
  search: t.Optional(t.String()),
  minAmount: t.Optional(t.Numeric()),
  maxAmount: t.Optional(t.Numeric()),
  minTenor: t.Optional(t.Numeric()),
  maxTenor: t.Optional(t.Numeric()),
  maxRate: t.Optional(t.Numeric()),
  shariaOnly: t.Optional(t.Boolean()),
  sortBy: t.Optional(
    t.Union([
      t.Literal("rate_asc"),
      t.Literal("rate_desc"),
      t.Literal("amount_desc"),
      t.Literal("rating_desc"),
      t.Literal("popular"),
    ]),
  ),
});

export const CompareProductsSchema = t.Object({
  ids: t.Array(t.Numeric({ minimum: 1 })),
});

export type ProductFilter = typeof ProductFilterSchema.static;
