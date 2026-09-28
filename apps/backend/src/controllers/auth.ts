import { Elysia, t } from "elysia";
import { AuthService, requireUser, sessionCookie } from "../services/auth";
import { RateLimiter } from "../middleware/security";
import { HttpError } from "../domain/errors";
const credentials = {
  email: t.String({ format: "email", maxLength: 254 }),
  password: t.String({ minLength: 12, maxLength: 128 }),
};
export const createAuthController = (auth: AuthService, secure: boolean, limiter: RateLimiter) =>
  new Elysia({ prefix: "/api/auth" })
    .post(
      "/login",
      async ({ body, request, set }) => {
        const rate = await limiter.consume(
          `login-account:${body.email.trim().toLowerCase()}`,
          10,
          900,
        );
        if (!rate.allowed)
          throw new HttpError(429, "Terlalu banyak percobaan masuk. Coba lagi nanti.");
        const { user, token } = await auth.login(body.email, body.password, request);
        set.headers["set-cookie"] = sessionCookie(token, secure);
        return { success: true, data: user };
      },
      { body: t.Object(credentials) },
    )
    .post(
      "/register",
      async ({ body, request, set }) => {
        const { user, token } = await auth.register(
          body.email,
          body.fullName,
          body.password,
          body.role,
          request,
        );
        set.headers["set-cookie"] = sessionCookie(token, secure);
        set.status = 201;
        return { success: true, data: user };
      },
      {
        body: t.Object({
          ...credentials,
          fullName: t.String({ minLength: 3, maxLength: 128 }),
          role: t.Union([t.Literal("borrower"), t.Literal("lender")]),
        }),
      },
    )
    .get("/me", async ({ request }) => ({
      success: true,
      data: requireUser(await auth.user(request)),
    }))
    .post("/logout", async ({ request, set }) => {
      await auth.logout(request);
      set.headers["set-cookie"] = sessionCookie("", secure, true);
      return { success: true };
    });
