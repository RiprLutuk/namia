import { Elysia, t } from "elysia";
import { mockDb } from "../db/mockData";
import { CreateLeadSchema, UpdateKycStepSchema } from "../schemas/lead";

export const leadController = new Elysia({ prefix: "/api/leads" })
  // 1. Create initial lead / registration
  .post("/", ({ body }) => {
    const newLead = mockDb.addLead({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      needCategory: body.needCategory || "p2p-lending",
      targetAmount: body.targetAmount ? Number(body.targetAmount) : undefined,
      targetTenorMonths: body.targetTenorMonths ? Number(body.targetTenorMonths) : undefined,
      notes: body.notes
    });

    return {
      success: true,
      message: "Data prospek awal berhasil disimpan",
      data: newLead
    };
  }, {
    body: CreateLeadSchema,
    detail: {
      tags: ["Leads & KYC"],
      summary: "Register new lead / prospect"
    }
  })

  // 2. Update multi-step KYC simulator
  .patch("/:id/kyc", ({ params, body, set }) => {
    const leadId = Number(params.id);
    const updated = mockDb.updateLeadKyc(leadId, {
      step: Number(body.step),
      nik: body.nik,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      employmentType: body.employmentType,
      monthlyIncome: body.monthlyIncome ? Number(body.monthlyIncome) : undefined
    });

    if (!updated) {
      set.status = 404;
      return { success: false, message: "Data lead tidak ditemukan" };
    }

    return {
      success: true,
      message: `KYC tahap ${body.step} berhasil diperbarui`,
      data: updated
    };
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: UpdateKycStepSchema,
    detail: {
      tags: ["Leads & KYC"],
      summary: "Progress KYC verification wizard step"
    }
  })

  // 3. Get lead status
  .get("/:id", ({ params, set }) => {
    const leadId = Number(params.id);
    const lead = mockDb.leads.find((l) => l.id === leadId);
    if (!lead) {
      set.status = 404;
      return { success: false, message: "Data lead tidak ditemukan" };
    }
    return {
      success: true,
      data: lead
    };
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ["Leads & KYC"],
      summary: "Get KYC onboarding status"
    }
  });
