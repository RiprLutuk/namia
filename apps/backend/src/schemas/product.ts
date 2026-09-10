import { pgTable, serial, varchar, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { t } from "elysia";

// --- Drizzle Schema ---
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).unique().notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow()
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  provider: varchar("provider", { length: 128 }).notNull(),
  logo: varchar("logo", { length: 256 }),
  description: text("description").notNull(),
  minAmount: numeric("min_amount").notNull(),
  maxAmount: numeric("max_amount").notNull(),
  minTenorMonths: integer("min_tenor_months").notNull(),
  maxTenorMonths: integer("max_tenor_months").notNull(),
  interestRateAnnual: numeric("interest_rate_annual").notNull(), // or margin rate
  adminFee: numeric("admin_fee").default("0"),
  rating: numeric("rating").default("4.5"),
  shariaAccredited: boolean("sharia_accredited").default(true),
  contractType: varchar("contract_type", { length: 64 }), // Murabahah, Mudharabah, Musyarakah, Ijarah, Qardh
  features: text("features"), // JSON stringified array of features
  applyUrl: varchar("apply_url", { length: 256 }),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

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
  sortBy: t.Optional(t.Union([
    t.Literal("rate_asc"),
    t.Literal("rate_desc"),
    t.Literal("amount_desc"),
    t.Literal("rating_desc"),
    t.Literal("popular")
  ]))
});

export const CompareProductsSchema = t.Object({
  ids: t.Array(t.Numeric({ minimum: 1 }))
});

export type ProductFilter = typeof ProductFilterSchema.static;
