import postgres from "postgres";

export function connectDatabase(url: string) {
  if (!url) throw new Error("DATABASE_URL is required");
  return postgres(url, { max: 10, idle_timeout: 20, connect_timeout: 5 });
}
export type Database = ReturnType<typeof connectDatabase>;
