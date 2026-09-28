import { HttpError } from "./errors";
const linkKeys = /(?:url|website|photo|logo|avatar|facebook|instagram|twitter|linkedin|youtube)$/i;
export function validateContent(value: unknown, key = "", depth = 0): void {
  if (depth > 20) throw new HttpError(422, "Struktur konten terlalu dalam.");
  if (typeof value === "string") {
    if (value.length > 100000) throw new HttpError(422, "Konten terlalu panjang.");
    if (linkKeys.test(key) && value && !/^(?:https?:\/\/|\/(?!\/)|#)/i.test(value))
      throw new HttpError(422, "Tautan harus berupa HTTPS/HTTP atau path situs.");
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))
      throw new HttpError(422, "Konten mengandung karakter kontrol.");
  } else if (Array.isArray(value)) {
    if (value.length > 10000) throw new HttpError(422, "Terlalu banyak item.");
    value.forEach((item) => validateContent(item, key, depth + 1));
  } else if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(childKey))
        throw new HttpError(422, "Properti konten tidak valid.");
      validateContent(childValue, childKey, depth + 1);
    }
  }
}
export const cdata = (value: unknown) => String(value ?? "").replaceAll("]]>", "]]]]><![CDATA[>");
