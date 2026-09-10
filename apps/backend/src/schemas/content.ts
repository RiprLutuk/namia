import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { t } from "elysia";

// --- Drizzle Tables ---
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  photo: varchar("photo", { length: 256 }),
  author: varchar("author", { length: 128 }).default("Syarfi Editorial Team"),
  category: varchar("category", { length: 64 }).default("Edu-Fintech"),
  publishedAt: timestamp("published_at").defaultNow()
});

export const personil = pgTable("personil", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 128 }).notNull(),
  jobLevel: integer("job_level").notNull(), // 1: Sharia Supervisory Board, 2: Commissioners, 3: Directors, 4: Management
  jobTitle: varchar("job_title", { length: 128 }).notNull(),
  biography: text("biography").notNull(),
  photo: varchar("photo", { length: 256 }),
  department: varchar("department", { length: 64 })
});

export const faqCategories = pgTable("faq_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  isInvestor: integer("is_investor").default(0) // 0 for borrower, 1 for investor
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => faqCategories.id).notNull(),
  question: varchar("question", { length: 512 }).notNull(),
  answer: text("answer").notNull()
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 64 }).notNull(),
  amount: varchar("amount", { length: 32 }).notNull(),
  unit: varchar("unit", { length: 16 }),
  icon: varchar("icon", { length: 64 })
});

// --- TypeBox Schemas ---
export const FaqQuerySchema = t.Object({
  isInvestor: t.Optional(t.Numeric()),
  categoryId: t.Optional(t.Numeric()),
  search: t.Optional(t.String())
});

export const BlogQuerySchema = t.Object({
  search: t.Optional(t.String()),
  category: t.Optional(t.String()),
  limit: t.Optional(t.Numeric()),
  offset: t.Optional(t.Numeric())
});
