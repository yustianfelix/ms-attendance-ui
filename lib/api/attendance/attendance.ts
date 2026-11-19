import { request } from "../client";
import type { ApiResponse } from "../shared/dto";
import type {
  AttendanceRecord,
  AttendanceSummaryData,
  RecordAttendancePayload,
} from "./dto";

export async function recordAttendance(
  payload: RecordAttendancePayload
): Promise<ApiResponse<AttendanceRecord>> {
  return request<ApiResponse<AttendanceRecord>>("/attendance", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAttendanceSummary(
  employeeId: string,
  startDate?: string,
  endDate?: string
): Promise<AttendanceSummaryData> {
  const response = await request<ApiResponse<AttendanceSummaryData>>(
    "/attendance/summary",
    {
      method: "POST",
      body: JSON.stringify({
        employee_id: employeeId,
        ...(startDate ? { start_date: startDate } : {}),
        ...(endDate ? { end_date: endDate } : {}),
      }),
    }
  );
  if (response.data) return response.data;
  return response as unknown as AttendanceSummaryData;
}
