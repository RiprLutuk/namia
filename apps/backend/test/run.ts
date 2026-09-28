import { temporaryDatabase } from "./database";
const database = await temporaryDatabase();
let exitCode = 1;
try {
  const tests = Bun.spawn([process.execPath, "test", "test/api.test.ts", "--timeout", "20000"], {
    cwd: new URL("..", import.meta.url).pathname,
    env: { ...process.env, TEST_DATABASE_URL: database.url, NODE_ENV: "test" },
    stdout: "inherit",
    stderr: "inherit",
  });
  exitCode = await tests.exited;
} finally {
  await database.close();
}
process.exit(exitCode);
