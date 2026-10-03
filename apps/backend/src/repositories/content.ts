import type { Database } from "../config/db";
import { ContentState } from "../db/content-state";
import { readContent, writeContent } from "../db/domain-tables";

export class ContentRepository {
  constructor(private readonly sql: Database) {}
  async read<T>(operation: (state: ContentState) => T): Promise<T> {
    const result = await this.sql.begin(async (tx) => {
      // Shared lock keeps settings and domain tables on the same committed revision.
      const [row] = await tx`SELECT data FROM app_content WHERE id = 1 FOR SHARE`;
      if (!row) throw new Error("Content migration is required");
      return { value: operation(await readContent(tx, row.data)) };
    });
    return (result as { value: T }).value;
  }
  async write<T>(operation: (state: ContentState) => T): Promise<T> {
    const result = await this.sql.begin(async (tx) => {
      const [row] = await tx`SELECT data FROM app_content WHERE id = 1 FOR UPDATE`;
      if (!row) throw new Error("Content migration is required");
      const previous = await readContent(tx, row.data);
      const state = new ContentState(JSON.parse(JSON.stringify(previous)));
      const value = operation(state);
      await writeContent(tx, state, previous);
      return { value };
    });
    return (result as { value: T }).value;
  }
}
