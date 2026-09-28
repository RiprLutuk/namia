import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:net";

export async function freePort() {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as { port: number }).port;
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}
export async function temporaryDatabase() {
  const binaryPath = Bun.which("initdb");
  const binaries =
    process.env.PG_BIN ||
    (binaryPath ? join(binaryPath, "..") : "/opt/homebrew/opt/postgresql@18/bin");
  const directory = await mkdtemp(join(tmpdir(), "namia-test-pg-"));
  const port = await freePort();
  async function pg(command: string, args: string[]) {
    const proc = Bun.spawn([join(binaries, command), ...args], { stdout: "pipe", stderr: "pipe" });
    const [out, err, code] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    if (code) throw new Error(`${command} failed: ${out}\n${err}`);
  }
  let started = false;
  async function close() {
    if (started) await pg("pg_ctl", ["-D", directory, "-m", "immediate", "-w", "stop"]);
    await rm(directory, { recursive: true, force: true });
  }
  try {
    await pg("initdb", [
      "-D",
      directory,
      "-U",
      "audit_test",
      "--auth=trust",
      "--no-locale",
      "-E",
      "UTF8",
    ]);
    await pg("pg_ctl", [
      "-D",
      directory,
      "-l",
      join(directory, "server.log"),
      "-o",
      `-h 127.0.0.1 -p ${port} -k ${directory}`,
      "-w",
      "start",
    ]);
    started = true;
    return { url: `postgres://audit_test@127.0.0.1:${port}/postgres`, close };
  } catch (error) {
    await close();
    throw error;
  }
}
