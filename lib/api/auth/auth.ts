import { request } from "../client";
import { setAuthSession } from "../session";
import type { EmployeeProfile } from "../../employee/dto";
import type { LoginCredentials, LoginResponse, LoginResult } from "./dto";

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((character) =>
          "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResult> {
  const response = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  const token =
    response.access_token ||
    (response.data && response.data.access_token) ||
    "";

  if (!token) {
    throw new Error(
      "Authentication succeeded but no access token was returned."
    );
  }

  const jwtPayload = parseJwt(token);
  const sub = (jwtPayload?.sub as string) || "";

  const user: EmployeeProfile = {
    employeeId: response.data?.employeeId ?? sub ?? "",
    name:
      response.data?.name ??
      (jwtPayload?.name as string) ??
      credentials.email,
    email:
      response.data?.email ??
      (jwtPayload?.email as string) ??
      credentials.email,
    role: response.data?.role ?? (jwtPayload?.role as string) ?? "employee",
    photo: response.data?.photo ?? null,
    phoneNumber: response.data?.phoneNumber ?? null,
  };

  setAuthSession(token, user);
  return { token, user, raw: response };
}
