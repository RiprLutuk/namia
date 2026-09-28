import type { Database } from "../config/db";
import { ContentState } from "../db/content-state";

export class ContentRepository {
  constructor(private readonly sql: Database) {}

  async read<T>(operation: (state: ContentState) => T): Promise<T> {
    const [row] = await this.sql`SELECT data FROM app_content WHERE id = 1`;
    if (!row) throw new Error("Content migration is required");
    return operation(new ContentState(row.data));
  }

  async write<T>(operation: (state: ContentState) => T): Promise<T> {
    // Each writer starts from the latest committed version. Failed operations never leak state.
    const result = await this.sql.begin(async (tx) => {
      const [row] = await tx`SELECT data FROM app_content WHERE id = 1 FOR UPDATE`;
      if (!row) throw new Error("Content migration is required");
      const state = new ContentState(row.data);
      const result = operation(state);
      await tx`UPDATE app_content SET data = ${tx.json(JSON.parse(JSON.stringify(state)))} WHERE id = 1`;
      return { value: result };
    });
    return (result as { value: T }).value;
  }
}
