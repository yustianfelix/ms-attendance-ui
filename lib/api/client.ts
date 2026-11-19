import { getStoredToken } from "./session";

export const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL?.replace(/\/$/, "") ||
  "http://localhost:3040";

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const url = `${GATEWAY_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    if (typeof data === "object" && data !== null) {
      if ("message" in data) {
        errorMsg = Array.isArray(data.message)
          ? data.message.join(", ")
          : String(data.message);
      } else if ("error" in data) {
        errorMsg = String(data.error);
      }
    } else if (typeof data === "string" && data) {
      errorMsg = data;
    }
    throw new Error(errorMsg);
  }

  return data as T;
}
