import { writable } from "svelte/store";
import { apiRequest, ApiError } from "./api";
export type Role = "admin" | "borrower" | "lender";
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}
// This store is populated only in the browser; user data is never held in SSR module state.
export const currentUser = writable<User | null>(null);
export async function refreshSession() {
  try {
    const result = await apiRequest<User>("/api/auth/me");
    currentUser.set(result.data);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      currentUser.set(null);
      return null;
    }
    throw error;
  }
}
export async function login(email: string, password: string) {
  const { data } = await apiRequest<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  currentUser.set(data);
  return data;
}
export async function register(
  fullName: string,
  email: string,
  password: string,
  role: "borrower" | "lender",
) {
  const { data } = await apiRequest<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password, role }),
  });
  currentUser.set(data);
  return data;
}
export async function logout() {
  await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
  currentUser.set(null);
  window.location.assign("/");
}
