export interface AttendanceRecord {
  uuid: string;
  employeeId: string;
  date: string;
  status: string;
  clockIn: string;
  clockOut: string | null;
}

export interface AttendanceSummaryData {
  employee_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  attendances: AttendanceRecord[];
}

export interface RecordAttendancePayload {
  employee_id: string;
  action: "clock-in" | "clock-out";
  date: string;
}
