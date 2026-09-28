import { t } from "elysia";

// --- TypeBox Schemas ---
export const FaqQuerySchema = t.Object({
  isInvestor: t.Optional(t.Numeric()),
  categoryId: t.Optional(t.Numeric()),
  search: t.Optional(t.String()),
});

export const BlogQuerySchema = t.Object({
  search: t.Optional(t.String()),
  category: t.Optional(t.String()),
  limit: t.Optional(t.Numeric()),
  offset: t.Optional(t.Numeric()),
});
