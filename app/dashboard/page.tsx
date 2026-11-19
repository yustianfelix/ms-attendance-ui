"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  getAttendanceSummary,
  recordAttendance,
} from "@/lib/api/attendance/attendance";
import type { AttendanceRecord } from "@/lib/api/attendance/dto";
import { useAuth } from "@/lib/auth-context";
import { DashboardAttendanceCard } from "./_components/dashboard-attendance-card";
import { DashboardProfileCard } from "./_components/dashboard-profile-card";
import { DashboardSummaryCard } from "./_components/dashboard-summary-card";

export default function DashboardPage() {
  const { user, isLoading, refreshProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Welcome back");
  const [clockActionLoading, setClockActionLoading] = useState<string | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [summaryTotalDays, setSummaryTotalDays] = useState<number | null>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const employeeId = user?.employeeId;

  // Fetch summary and today's status
  useEffect(() => {
    if (!employeeId) return;

    // Refresh profile in background
    refreshProfile();

    const todayDate = new Date().toISOString().split("T")[0];

    // Load recent attendances to find today's clock in/out if recorded
    getAttendanceSummary(employeeId)
      .then((res) => {
        setSummaryTotalDays(res.total_days ?? res.attendances?.length ?? 0);
        if (res.attendances && res.attendances.length > 0) {
          const match = res.attendances.find((a) => a.date?.startsWith(todayDate));
          if (match) {
            setTodayRecord(match);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load summary preview:", err);
      });
  }, [employeeId, refreshProfile]);

  const handleQuickClock = async (action: "clock-in" | "clock-out") => {
    if (!user?.employeeId) {
      toast.error("Employee ID not found. Please log in again.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    setClockActionLoading(action);

    try {
      const res = await recordAttendance({
        employee_id: String(user.employeeId),
        action,
        date: today,
      });

      const actionLabel = action === "clock-in" ? "Clock In" : "Clock Out";
      toast.success(`${actionLabel} recorded successfully!`);

      if (res.data) {
        setTodayRecord(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record attendance";
      toast.error(msg);
    } finally {
      setClockActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="flex flex-col items-center gap-3 text-[#176b50]">
          <Loader2 className="size-8 animate-spin" />
          <p className="text-sm font-medium text-[#5a6b60]">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#17261f]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-[#176b50] via-[#1a7759] to-[#258a69] p-6 text-white shadow-[0_16px_36px_-12px_rgba(23,107,80,0.35)] sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div
                className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#b4dfcb] uppercase">
                <Sparkles className="size-3.5" />
                <span>Attendance Workspace</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {greeting}, {user?.name || "Team Member"}!
              </h1>
              <p className="mt-1 text-sm text-[#d4ebe0]">
                {currentDateStr || "Welcome to your daily attendance dashboard"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-md">
                <Clock className="size-4 text-[#a3dec1]" />
                <span className="font-mono text-sm tracking-wide">
                  {currentTime || "--:--:--"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Column 1 & 2: Quick Actions & Status */}
          <div className="space-y-6 lg:col-span-2">
            <DashboardAttendanceCard
              todayRecord={todayRecord}
              clockActionLoading={clockActionLoading}
              onClock={handleQuickClock}
            />
            <DashboardSummaryCard totalDays={summaryTotalDays} />
          </div>

          {/* Column 3: User Profile Widget */}
          <div className="space-y-6">
            <DashboardProfileCard user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}
