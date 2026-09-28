import { t } from "elysia";
export const CreateLeadSchema = t.Object(
  {
    fullName: t.String({ minLength: 3, maxLength: 128 }),
    email: t.String({ format: "email", maxLength: 254 }),
    phone: t.String({ pattern: "^\\+?[0-9 ()-]{8,20}$", maxLength: 21 }),
    needCategory: t.Optional(t.String({ maxLength: 100 })),
    targetAmount: t.Optional(t.Number({ minimum: 2000000, maximum: 2000000000 })),
    targetTenorMonths: t.Optional(t.Integer({ minimum: 3, maximum: 60 })),
    notes: t.Optional(t.String({ maxLength: 5000 })),
  },
  { additionalProperties: false },
);
export const SubmitKycSchema = t.Object(
  {
    nik: t.String({ pattern: "^[0-9]{16}$" }),
    employmentType: t.Union([
      t.Literal("entrepreneur"),
      t.Literal("permanent_employee"),
      t.Literal("contract_employee"),
      t.Literal("freelancer"),
    ]),
    monthlyIncome: t.Number({ exclusiveMinimum: 0, maximum: 1000000000000 }),
    consent: t.Literal(true),
  },
  { additionalProperties: false },
);
export const ReviewKycSchema = t.Object(
  {
    decision: t.Union([t.Literal("verified"), t.Literal("rejected")]),
    note: t.String({ minLength: 10, maxLength: 2000 }),
  },
  { additionalProperties: false },
);

export const ContactSchema = t.Object(
  {
    fullName: t.String({ minLength: 3, maxLength: 128 }),
    email: t.String({ format: "email", maxLength: 254 }),
    phone: t.Optional(t.String({ pattern: "^\\+?[0-9 ()-]{8,20}$", maxLength: 21 })),
    needCategory: t.Optional(t.String({ maxLength: 100 })),
    notes: t.String({ minLength: 1, maxLength: 5000 }),
  },
  { additionalProperties: false },
);
