import { pgTable, serial, varchar, text, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { t } from "elysia";

// --- Drizzle Schema ---
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 128 }).notNull(),
  email: varchar("email", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  nik: varchar("nik", { length: 16 }),
  dateOfBirth: varchar("date_of_birth", { length: 32 }),
  address: text("address"),
  employmentType: varchar("employment_type", { length: 64 }), // Employee, Entrepreneur, Professional, Corporate
  monthlyIncome: numeric("monthly_income"),
  needCategory: varchar("need_category", { length: 64 }), // p2p, business, asset, investment
  targetAmount: numeric("target_amount"),
  targetTenorMonths: integer("target_tenor_months"),
  kycStep: integer("kyc_step").default(1),
  status: varchar("status", { length: 32 }).default("pending"), // pending, verified, forwarded, rejected
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// --- TypeBox Schemas ---
export const CreateLeadSchema = t.Object({
  fullName: t.String({ minLength: 3, maxLength: 128 }),
  email: t.String({ format: "email" }),
  phone: t.String({ minLength: 8, maxLength: 20 }),
  needCategory: t.Optional(t.String()),
  targetAmount: t.Optional(t.Numeric()),
  targetTenorMonths: t.Optional(t.Numeric()),
  notes: t.Optional(t.String())
});

export const UpdateKycStepSchema = t.Object({
  step: t.Numeric({ minimum: 1, maximum: 4 }),
  nik: t.Optional(t.String({ minLength: 16, maxLength: 16 })),
  dateOfBirth: t.Optional(t.String()),
  address: t.Optional(t.String()),
  employmentType: t.Optional(t.String()),
  monthlyIncome: t.Optional(t.Numeric()),
  bankAccount: t.Optional(t.String())
});
