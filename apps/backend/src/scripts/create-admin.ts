import { connectDatabase } from "../config/db";
import { IdentityRepository } from "../repositories/identity";
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (
  !email ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  !password ||
  password.length < 12 ||
  password.length > 128
)
  throw new Error(
    "Provide ADMIN_EMAIL and ADMIN_PASSWORD (12–128 characters) through environment variables.",
  );
const sql = connectDatabase(process.env.DATABASE_URL || "");
try {
  await new IdentityRepository(sql).createAccount(
    email,
    "Administrator",
    await Bun.password.hash(password, { algorithm: "argon2id" }),
    "admin",
  );
  console.log("Administrator created. No default password is provided.");
} finally {
  await sql.end();
}
