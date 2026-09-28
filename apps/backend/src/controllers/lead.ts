import { Elysia, t } from "elysia";
import type { LeadRepository } from "../repositories/leads";
import { AuthService, requireUser } from "../services/auth";
import { CreateLeadSchema, ContactSchema, SubmitKycSchema, ReviewKycSchema } from "../schemas/lead";
import { submitKyc, reviewKyc } from "../domain/lead";
const idParams = t.Object({ id: t.Numeric({ minimum: 1, maximum: 2147483647, multipleOf: 1 }) });
export const createLeadController = (repository: LeadRepository, auth: AuthService) =>
  new Elysia({ prefix: "/api" })
    .get(
      "/contacts",
      async ({ request, query }) => {
        requireUser(await auth.user(request), ["admin"]);
        return { success: true, data: await repository.contacts(Number(query.page || 1)) };
      },
      {
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1, maximum: 100000, multipleOf: 1 })),
        }),
      },
    )
    .post(
      "/contacts",
      async ({ body, set }) => {
        const reference = await repository.contact(body);
        set.status = 201;
        return { success: true, data: { reference } };
      },
      { body: ContactSchema },
    )
    .post(
      "/leads",
      async ({ body, request, set }) => {
        const user = requireUser(await auth.user(request), ["borrower"]);
        const data = await repository.create(body, user);
        set.status = 201;
        return { success: true, data };
      },
      { body: CreateLeadSchema },
    )
    .get(
      "/leads",
      async ({ request, query }) => {
        const user = requireUser(await auth.user(request), ["admin", "borrower"]);
        return { success: true, data: await repository.list(user, Number(query.page || 1)) };
      },
      {
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1, maximum: 100000, multipleOf: 1 })),
        }),
      },
    )
    .get(
      "/leads/:id",
      async ({ request, params }) => ({
        success: true,
        data: await repository.get(
          Number(params.id),
          requireUser(await auth.user(request), ["admin", "borrower"]),
        ),
      }),
      { params: idParams },
    )
    .patch(
      "/leads/:id/kyc",
      async ({ request, params, body }) => {
        const user = requireUser(await auth.user(request), ["borrower"]);
        const data = await repository.update(Number(params.id), user, "kyc.submit", (lead) =>
          submitKyc(lead, body),
        );
        return { success: true, data };
      },
      { params: idParams, body: SubmitKycSchema },
    )
    .post(
      "/leads/:id/review",
      async ({ request, params, body }) => {
        const user = requireUser(await auth.user(request), ["admin"]);
        const data = await repository.update(
          Number(params.id),
          user,
          `kyc.${body.decision}`,
          (lead) => reviewKyc(lead, user, body.decision, body.note),
        );
        return { success: true, data };
      },
      { params: idParams, body: ReviewKycSchema },
    );
