import {AttendanceRecord} from "@/lib/api/attendance/dto/attendance.dto";

export interface AttendanceEntriesCardProps {
    records: AttendanceRecord[];
    isFetching: boolean;
    onRefresh: () => void;
    calculateDuration: (inTime?: string, outTime?: string | null) => string;
}