import Link from "next/link";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AttendanceRecord } from "@/lib/api/attendance/dto";

interface DashboardAttendanceCardProps {
  todayRecord: AttendanceRecord | null;
  clockActionLoading: string | null;
  onClock: (action: "clock-in" | "clock-out") => void;
}

export function DashboardAttendanceCard({
  todayRecord,
  clockActionLoading,
  onClock,
}: DashboardAttendanceCardProps) {
  return (
    <Card className="rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#edf0ec] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f3ed] text-[#176b50]">
            <Clock className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#17261f]">
              Today&apos;s Attendance
            </h2>
            <p className="text-xs text-[#718078]">Record your daily work shift</p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-[#e8f3ed] px-3 py-1 text-xs font-semibold text-[#176b50]">
          <span className="size-2 animate-pulse rounded-full bg-[#176b50]" />
          Live Sync
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-[#e5eae5] bg-[#fafcfa] p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-[#697a70] uppercase">
                Shift Start
              </span>
              {todayRecord?.clockIn && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" /> Recorded
                </span>
              )}
            </div>
            <p className="mt-2 text-xl font-bold text-[#17261f]">
              {todayRecord?.clockIn
                ? new Date(todayRecord.clockIn).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not Clocked In"}
            </p>
          </div>
          <Button
            onClick={() => onClock("clock-in")}
            disabled={clockActionLoading !== null}
            className="mt-4 h-11 w-full rounded-xl bg-[#176b50] font-semibold text-white hover:bg-[#12583f]"
          >
            {clockActionLoading === "clock-in" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Clock In Now"
            )}
          </Button>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#e5eae5] bg-[#fafcfa] p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-[#697a70] uppercase">
                Shift End
              </span>
              {todayRecord?.clockOut && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" /> Recorded
                </span>
              )}
            </div>
            <p className="mt-2 text-xl font-bold text-[#17261f]">
              {todayRecord?.clockOut
                ? new Date(todayRecord.clockOut).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not Clocked Out"}
            </p>
          </div>
          <Button
            onClick={() => onClock("clock-out")}
            disabled={clockActionLoading !== null}
            variant="outline"
            className="mt-4 h-11 w-full rounded-xl border-[#d3ded5] text-[#176b50] hover:bg-[#e8f1ec]"
          >
            {clockActionLoading === "clock-out" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Clock Out Now"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f0f4f1] p-3 text-xs text-[#526358]">
        <span>Need a full screen interface for attendance?</span>
        <Link
          href="/attendance"
          className="font-semibold text-[#176b50] hover:underline"
        >
          Go to Clock In/Out &rarr;
        </Link>
      </div>
    </Card>
  );
}
