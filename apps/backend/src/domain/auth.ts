export type Role = "admin" | "borrower" | "lender";
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}
export interface Account extends User {
  passwordHash: string;
}
