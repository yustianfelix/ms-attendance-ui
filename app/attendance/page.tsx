"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Fingerprint,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import {
  getAttendanceSummary,
  recordAttendance,
} from "@/lib/api/attendance/attendance";
import type { AttendanceRecord } from "@/lib/api/attendance/dto";
import { useAuth } from "@/lib/auth-context";
import {
  AttendanceActionCards,
  AttendanceClockCard,
  AttendanceShiftDetails,
} from "./_components/attendance-cards";

export default function AttendancePage() {
  const { user, isLoading } = useAuth();
  const [time, setTime] = useState({
    hours: "--",
    minutes: "--",
    seconds: "--",
    period: "AM",
    fullDate: "",
    isoDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<"clock-in" | "clock-out" | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(false);

  // Real-time clock tick
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let hours = now.getHours();
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      setTime({
        hours: String(hours).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        seconds: String(now.getSeconds()).padStart(2, "0"),
        period,
        fullDate: now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        isoDate: now.toISOString().split("T")[0],
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const employeeId = user?.employeeId;

  // Fetch today's record
  useEffect(() => {
    if (!employeeId) return;

    const todayStr = new Date().toISOString().split("T")[0];

    getAttendanceSummary(employeeId, todayStr, todayStr)
      .then((res) => {
        if (res.attendances && res.attendances.length > 0) {
          const found = res.attendances.find((a) => a.date?.startsWith(todayStr));
          if (found) setTodayRecord(found);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch today attendance:", err);
      })
      .finally(() => {
        setLoadingRecord(false);
      });
  }, [employeeId]);

  const handleAction = async (action: "clock-in" | "clock-out") => {
    if (!user?.employeeId) {
      toast.error("Employee session invalid. Please log in again.");
      return;
    }

    const today = time.isoDate || new Date().toISOString().split("T")[0];
    setIsSubmitting(action);

    try {
      const res = await recordAttendance({
        employee_id: String(user.employeeId),
        action,
        date: today,
      });

      const label = action === "clock-in" ? "Clock In" : "Clock Out";
      toast.success(`${label} successfully recorded at ${time.hours}:${time.minutes} ${time.period}!`);

      if (res.data) {
        setTodayRecord(res.data);
      } else {
        // Refresh summary
        const summary = await getAttendanceSummary(user.employeeId, today, today);
        if (summary.attendances?.length) {
          setTodayRecord(summary.attendances[0]);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record attendance action";
      toast.error(msg);
    } finally {
      setIsSubmitting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <Loader2 className="size-8 animate-spin text-[#176b50]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#17261f]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#65766b] transition-colors hover:text-[#176b50]"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold text-[#176b50]">
            <Fingerprint className="size-3.5" />
            Attendance Punch
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17261f]">
            Clock In & Clock Out
          </h1>
          <p className="mt-1 text-sm text-[#6c7d71]">
            Record your attendance shift. Timestamp is synced directly with your company gateway.
          </p>
        </div>

        <AttendanceClockCard time={time} />

        {/* Action Buttons Grid */}
        <AttendanceActionCards
          todayRecord={todayRecord}
          loadingRecord={loadingRecord}
          isSubmitting={isSubmitting}
          onAction={handleAction}
        />

        {/* Shift Details Banner */}
        {todayRecord && (
          <AttendanceShiftDetails record={todayRecord} />
        )}
      </main>
    </div>
  );
}
