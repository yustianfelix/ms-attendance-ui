import { request } from "../client";
import { getStoredToken, getStoredUser, setAuthSession } from "../session";
import type { ApiResponse } from "../shared/dto";
import type { EmployeeProfile, UpdateEmployeeProfilePayload } from "./dto";

export async function getProfile(employeeId: string): Promise<EmployeeProfile> {
  const response = await request<ApiResponse<EmployeeProfile>>(
    `/employees/${encodeURIComponent(employeeId)}/profile`,
    { method: "GET" }
  );
  return response.data ?? (response as unknown as EmployeeProfile);
}

export async function updateProfile(
  employeeId: string,
  payload: UpdateEmployeeProfilePayload
): Promise<EmployeeProfile> {
  const cleanedPayload: UpdateEmployeeProfilePayload = {
    currentPassword: payload.currentPassword,
  };
  if (payload.photo !== undefined && payload.photo.trim() !== "") {
    cleanedPayload.photo = payload.photo.trim();
  }
  if (payload.phoneNumber !== undefined && payload.phoneNumber.trim() !== "") {
    cleanedPayload.phoneNumber = payload.phoneNumber.trim();
  }
  if (payload.newPassword !== undefined && payload.newPassword.trim() !== "") {
    cleanedPayload.newPassword = payload.newPassword;
  }

  const response = await request<ApiResponse<EmployeeProfile>>(
    `/employees/${encodeURIComponent(employeeId)}/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(cleanedPayload),
    }
  );

  const updatedProfile =
    response.data ?? (response as unknown as EmployeeProfile);

  const currentUser = getStoredUser();
  if (currentUser && currentUser.employeeId === employeeId) {
    const mergedUser = { ...currentUser, ...updatedProfile };
    const token = getStoredToken();
    if (token) {
      setAuthSession(token, mergedUser);
    }
  }

  return updatedProfile;
}
