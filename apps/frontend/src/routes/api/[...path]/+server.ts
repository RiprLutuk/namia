import { env } from "$env/dynamic/private";
import { error, type RequestHandler } from "@sveltejs/kit";
const MAX_BODY = 256 * 1024;
const proxy: RequestHandler = async ({ request, url, getClientAddress }) => {
  const backend = env.BACKEND_URL || "http://127.0.0.1:3000";
  const target = new URL(backend);
  target.pathname = url.pathname;
  target.search = url.search;
  const headers = new Headers();
  for (const name of ["content-type", "cookie", "origin", "sec-fetch-site"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-real-ip", getClientAddress());
  let body: Uint8Array | undefined;
  if (request.body && !["GET", "HEAD"].includes(request.method)) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > MAX_BODY) {
        await reader.cancel();
        error(413, "Payload terlalu besar.");
      }
      chunks.push(chunk.value);
    }
    body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
  }
  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: body as BodyInit | undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    error(503, "Layanan sedang tidak tersedia.");
  }
};
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
