import {
  Calendar,
  CheckCircle,
  History,
  LogIn,
  LogOut,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AttendanceRecord } from "@/lib/api/attendance/dto";

interface AttendanceTime {
  hours: string;
  minutes: string;
  seconds: string;
  period: string;
  fullDate: string;
  isoDate: string;
}

export function AttendanceClockCard({ time }: { time: AttendanceTime }) {
  return (
    <Card className="mb-8 overflow-hidden rounded-3xl border border-[#dce5df] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#176b50] uppercase">
          <Sparkles className="size-3.5" />
          <span>Current Workspace Time</span>
        </div>

        <div className="mt-4 flex items-baseline gap-2 sm:gap-3">
          <span className="font-mono text-5xl font-extrabold tracking-tight text-[#17261f] sm:text-6xl">
            {time.hours}:{time.minutes}:{time.seconds}
          </span>
          <span className="font-mono text-xl font-bold text-[#176b50] sm:text-2xl">
            {time.period}
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-[#65766c]">
          {time.fullDate || "Loading date..."}
        </p>

        <div
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f0f4f1] px-3.5 py-1.5 text-xs text-[#526358]">
          <Calendar className="size-3.5 text-[#176b50]" />
          <span>
            Shift Date:{" "}
            <strong className="font-mono text-[#17261f]">
              {time.isoDate || "YYYY-MM-DD"}
            </strong>
          </span>
        </div>
      </div>
    </Card>
  );
}

interface AttendanceActionCardsProps {
  todayRecord: AttendanceRecord | null;
  loadingRecord: boolean;
  isSubmitting: "clock-in" | "clock-out" | null;
  onAction: (action: "clock-in" | "clock-out") => void;
}

export function AttendanceActionCards({
  todayRecord,
  loadingRecord,
  isSubmitting,
  onAction,
}: AttendanceActionCardsProps) {
  const actions = [
    {
      action: "clock-in" as const,
      title: "Clock In",
      description: "Start your working hours for today.",
      recordTime: todayRecord?.clockIn,
      timeLabel: "Clock In Time",
      icon: LogIn,
      iconStyle: "bg-[#e8f3ed] text-[#176b50]",
      pendingStyle: "bg-amber-50 text-amber-700",
      buttonStyle:
        "bg-[#176b50] text-white shadow-sm hover:bg-[#12583f] disabled:opacity-60",
      buttonText: "Punch Clock In",
      loadingText: "Recording Clock In...",
    },
    {
      action: "clock-out" as const,
      title: "Clock Out",
      description: "End your working hours and record departure.",
      recordTime: todayRecord?.clockOut,
      timeLabel: "Clock Out Time",
      icon: LogOut,
      iconStyle: "bg-[#fbf0ed] text-[#b34026]",
      pendingStyle: "bg-slate-100 text-slate-600",
      buttonStyle:
        "border-[#d3ded5] text-[#17261f] shadow-sm hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60",
      buttonText: "Punch Clock Out",
      loadingText: "Recording Clock Out...",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {actions.map((item) => {
        const Icon = item.icon;
        const hasRecord = Boolean(item.recordTime);
        const isCurrentAction = isSubmitting === item.action;

        return (
          <Card
            key={item.action}
            className="flex flex-col justify-between rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm transition-all hover:border-[#176b50]/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl ${item.iconStyle}`}
                >
                  <Icon className="size-6" />
                </span>
                {hasRecord ? (
                  <span
                    className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="size-3.5" />
                    Recorded
                  </span>
                ) : (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.pendingStyle}`}
                  >
                    Pending
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#17261f]">
                {item.title}
              </h2>
              <p className="mt-1 text-xs text-[#718078]">{item.description}</p>

              <div className="mt-6 rounded-2xl bg-[#f7f9f7] p-4">
                <span className="block text-[11px] font-medium tracking-wide text-[#77877c] uppercase">
                  {item.timeLabel}
                </span>
                <span className="mt-1 block font-mono text-base font-bold text-[#17261f]">
                  {loadingRecord ? (
                    <Loader2 className="size-4 animate-spin text-[#176b50]" />
                  ) : item.recordTime ? (
                    new Date(item.recordTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  ) : (
                    "Not recorded yet"
                  )}
                </span>
              </div>
            </div>

            <Button
              onClick={() => onAction(item.action)}
              disabled={isSubmitting !== null}
              variant={item.action === "clock-out" ? "outline" : "default"}
              className={`mt-6 h-12 w-full rounded-xl text-sm font-semibold ${item.buttonStyle}`}
            >
              {isCurrentAction ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {item.loadingText}
                </>
              ) : (
                <>
                  <Icon className="mr-2 size-4" />
                  {item.buttonText}
                </>
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

export function AttendanceShiftDetails({
  record,
}: {
  record: AttendanceRecord;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-[#d7e3da] bg-[#eef5f0] p-5">
      <div className="flex items-center gap-3">
        <History className="size-5 text-[#176b50]" />
        <div>
          <h3 className="text-sm font-bold text-[#17261f]">
            Today&apos;s Shift Status:{" "}
            <span className="text-[#176b50] uppercase">
              {record.status || "Recorded"}
            </span>
          </h3>
          <p className="mt-0.5 text-xs text-[#526357]">
            UUID: <span className="font-mono">{record.uuid}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
