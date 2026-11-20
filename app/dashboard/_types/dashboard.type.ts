import {AttendanceRecord} from "@/lib/api/attendance/dto/attendance.dto";

export interface DashboardAttendanceCardProps {
    todayRecord: AttendanceRecord | null;
    clockActionLoading: string | null;
    onClock: (action: "clock-in" | "clock-out") => void;
}