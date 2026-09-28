import { createHash, randomBytes } from "node:crypto";
import type { IdentityRepository } from "../repositories/identity";
import type { Role, User } from "../domain/auth";
import { HttpError } from "../domain/errors";

export const SESSION_SECONDS = 8 * 60 * 60;
export const SESSION_COOKIE = "namia_session";
const digest = (token: string) => createHash("sha256").update(token).digest("hex");

const cookieName = (secure: boolean) => (secure ? "__Host-namia_session" : SESSION_COOKIE);
export function sessionToken(request: Request, secure = false) {
  const match = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(cookieName(secure) + "="));
  const token = match?.slice(cookieName(secure).length + 1);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : undefined;
}
export function sessionCookie(token: string, secure: boolean, clear = false) {
  return `${cookieName(secure)}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : SESSION_SECONDS}${secure ? "; Secure" : ""}`;
}
export function requireUser(user: User | undefined, roles?: Role[]): User {
  if (!user) throw new HttpError(401, "Silakan masuk terlebih dahulu.");
  if (roles && !roles.includes(user.role)) throw new HttpError(403, "Akses tidak diizinkan.");
  return user;
}

export class AuthService {
  private readonly dummyHash = Bun.password.hash(randomBytes(32).toString("hex"), {
    algorithm: "argon2id",
  });
  constructor(
    private readonly repository: IdentityRepository,
    private readonly secure = false,
  ) {}

  async user(request: Request) {
    const token = sessionToken(request, this.secure);
    return token ? this.repository.sessionUser(digest(token)) : undefined;
  }
  async login(email: string, password: string, request: Request) {
    const account = await this.repository.findAccount(email.trim().toLowerCase());
    const valid = await Bun.password.verify(
      password,
      account?.passwordHash || (await this.dummyHash),
    );
    if (!account || !valid) throw new HttpError(401, "Email atau kata sandi tidak valid.");
    const { passwordHash: _, ...user } = account;
    return this.issueSession(user, request);
  }
  async register(
    email: string,
    fullName: string,
    password: string,
    role: "borrower" | "lender",
    request: Request,
  ) {
    const normalized = email.trim().toLowerCase();
    const hash = await Bun.password.hash(password, { algorithm: "argon2id" });
    try {
      const user = await this.repository.createAccount(normalized, fullName.trim(), hash, role);
      return this.issueSession(user, request);
    } catch (error) {
      if ((error as { code?: string }).code === "23505")
        throw new HttpError(
          409,
          "Pendaftaran tidak dapat diproses. Gunakan akun yang sudah terdaftar.",
        );
      throw error;
    }
  }
  private async issueSession(user: User, request: Request) {
    const token = randomBytes(32).toString("hex");
    const previous = sessionToken(request, this.secure);
    await this.repository.createSession(
      digest(token),
      user.id,
      new Date(Date.now() + SESSION_SECONDS * 1000),
      previous ? digest(previous) : undefined,
    );
    return { user, token };
  }
  async logout(request: Request) {
    const token = sessionToken(request, this.secure);
    if (token) await this.repository.deleteSession(digest(token));
  }
}
