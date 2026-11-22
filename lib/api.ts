import {
  getAttendanceSummary,
  recordAttendance,
} from "./api/attendance/attendance";
import { login } from "./api/auth/auth";
import { getProfile, updateProfile } from "./api/employee/employee";

export { GATEWAY_URL } from "./api/client";
export {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  setAuthSession,
} from "./api/session";
export { parseJwt } from "./api/auth/auth";
export { getAttendanceSummary, recordAttendance } from "./api/attendance/attendance";
export { login } from "./api/auth/auth";
export { getProfile, updateProfile } from "./api/employee/employee";
export type { ApiResponse } from "./api/shared/dto/common.dto";
export type {
  AttendanceRecord,
  AttendanceSummaryData,
  RecordAttendancePayload,
} from "./api/attendance/dto/attendance.dto";
export type {
  LoginCredentials,
  LoginResponse,
  LoginResult,
} from "./api/auth/dto/auth.dto";
export type {
  EmployeeProfile,
  UpdateEmployeeProfilePayload,
} from "./api/employee/dto/employee.dto";

export const api = {
  login,
  getProfile,
  updateProfile,
  recordAttendance,
  getAttendanceSummary,
};
