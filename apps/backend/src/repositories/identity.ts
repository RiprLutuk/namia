import type { Database } from "../config/db";
import type { Account, Role, User } from "../domain/auth";

export class IdentityRepository {
  constructor(private readonly sql: Database) {}
  async findAccount(email: string): Promise<Account | undefined> {
    const [row] = await this.sql<
      Account[]
    >`SELECT id, email, full_name AS "fullName", role, password_hash AS "passwordHash" FROM app_users WHERE email = ${email}`;
    return row;
  }
  async createAccount(
    email: string,
    fullName: string,
    passwordHash: string,
    role: Role,
  ): Promise<User> {
    const [user] = await this.sql<
      User[]
    >`INSERT INTO app_users (id,email,full_name,password_hash,role)
      VALUES (${crypto.randomUUID()}, ${email}, ${fullName}, ${passwordHash}, ${role})
      RETURNING id,email,full_name AS "fullName",role`;
    return user!;
  }
  async createSession(tokenHash: string, userId: string, expiresAt: Date, previousHash?: string) {
    await this.sql.begin(async (tx) => {
      if (previousHash) await tx`DELETE FROM app_sessions WHERE token_hash = ${previousHash}`;
      await tx`DELETE FROM app_sessions WHERE expires_at < now()`;
      await tx`INSERT INTO app_sessions (token_hash,user_id,expires_at) VALUES (${tokenHash},${userId},${expiresAt})`;
    });
  }
  async sessionUser(tokenHash: string): Promise<User | undefined> {
    const [user] = await this.sql<
      User[]
    >`SELECT u.id,u.email,u.full_name AS "fullName",u.role FROM app_sessions s
      JOIN app_users u ON u.id = s.user_id WHERE s.token_hash = ${tokenHash} AND s.expires_at > now()`;
    return user;
  }
  async deleteSession(tokenHash: string) {
    await this.sql`DELETE FROM app_sessions WHERE token_hash = ${tokenHash}`;
  }
}
