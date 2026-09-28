import type { User } from "./auth";
import { HttpError } from "./errors";
export interface LeadInput {
  fullName: string;
  email: string;
  phone: string;
  needCategory?: string;
  targetAmount?: number;
  targetTenorMonths?: number;
  notes?: string;
}
export interface KycInput {
  nik: string;
  employmentType: string;
  monthlyIncome: number;
  consent: true;
}
export interface Lead extends LeadInput {
  id: number;
  ownerId: string | null;
  createdAt: string;
  kycStep: number;
  status: "pending" | "submitted" | "verified" | "rejected";
  nik?: string;
  employmentType?: string;
  monthlyIncome?: number;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}
export function assertLeadOwner(lead: Lead | undefined, user: User): asserts lead is Lead {
  // Do not reveal whether another customer's ID exists.
  if (!lead || (user.role !== "admin" && lead.ownerId !== user.id))
    throw new HttpError(404, "Pengajuan tidak ditemukan.");
}
export function submitKyc(lead: Lead, input: KycInput): Lead {
  if (lead.status !== "pending" && lead.status !== "rejected")
    throw new HttpError(409, "Pengajuan sudah dikirim dan sedang diproses.");
  return {
    ...lead,
    nik: input.nik,
    employmentType: input.employmentType,
    monthlyIncome: input.monthlyIncome,
    kycStep: 3,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    reviewedAt: undefined,
    reviewedBy: undefined,
    reviewNote: undefined,
  };
}
export function reviewKyc(
  lead: Lead,
  actor: User,
  decision: "verified" | "rejected",
  note: string,
): Lead {
  if (actor.role !== "admin") throw new HttpError(403, "Akses tidak diizinkan.");
  if (lead.ownerId === actor.id)
    throw new HttpError(403, "Tidak dapat memverifikasi pengajuan sendiri.");
  if (lead.status !== "submitted" || !lead.nik || !lead.employmentType || !lead.monthlyIncome)
    throw new HttpError(409, "Hanya pengajuan lengkap yang sudah dikirim dapat diperiksa.");
  return {
    ...lead,
    status: decision,
    kycStep: decision === "verified" ? 4 : 3,
    reviewedAt: new Date().toISOString(),
    reviewedBy: actor.id,
    reviewNote: note,
  };
}
