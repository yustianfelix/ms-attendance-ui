"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getAttendanceSummary } from "@/lib/api/attendance/attendance";
import type { AttendanceRecord } from "@/lib/api/attendance/dto/attendance.dto";
import { useAuth } from "@/lib/auth-context";
import {
  AttendanceEntriesCard,
  SummaryFilterCard,
  SummaryStatsCards,
  type SummaryPreset,
} from "./_components/summary-cards";

export default function SummaryPage() {
  const { user, isLoading } = useAuth();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>("all");

  const employeeId = user?.employeeId;

  // Initial fetch on mount & whenever employeeId, startDate, or endDate change
  useEffect(() => {
    if (!employeeId) return;
    let active = true;

    getAttendanceSummary(
      String(employeeId),
      startDate || undefined,
      endDate || undefined
    )
      .then((res) => {
        if (active) {
          setRecords(res.attendances || []);
          setTotalDays(res.total_days ?? res.attendances?.length ?? 0);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load attendance summary";
          toast.error(msg);
        }
      })
      .finally(() => {
        if (active) {
          setIsFetching(false);
        }
      });

    return () => {
      active = false;
    };
  }, [employeeId, startDate, endDate]);

  const handleManualFetch = async (from?: string, to?: string) => {
    if (!employeeId) return;
    setIsFetching(true);
    try {
      const res = await getAttendanceSummary(
        String(employeeId),
        from || undefined,
        to || undefined
      );
      setRecords(res.attendances || []);
      setTotalDays(res.total_days ?? res.attendances?.length ?? 0);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load attendance summary";
      toast.error(msg);
    } finally {
      setIsFetching(false);
    }
  };

  const handleApplyFilter = (e?: SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setActivePreset("custom");
    handleManualFetch(startDate, endDate);
  };

  const handlePreset = (preset: SummaryPreset) => {
    setActivePreset(preset);
    const now = new Date();

    if (preset === "week") {
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const from = monday.toISOString().split("T")[0];
      const to = sunday.toISOString().split("T")[0];
      setStartDate(from);
      setEndDate(to);
      handleManualFetch(from, to);
    } else if (preset === "month") {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
      setStartDate(from);
      setEndDate(to);
      handleManualFetch(from, to);
    } else if (preset === "last30") {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      const from = past.toISOString().split("T")[0];
      const to = new Date().toISOString().split("T")[0];
      setStartDate(from);
      setEndDate(to);
      handleManualFetch(from, to);
    } else if (preset === "all") {
      setStartDate("");
      setEndDate("");
      handleManualFetch();
    }
  };

  const calculateDuration = (inTime?: string, outTime?: string | null) => {
    if (!inTime || !outTime) return "-";
    try {
      const start = new Date(inTime).getTime();
      const end = new Date(outTime).getTime();
      const diffMs = end - start;
      if (diffMs <= 0) return "-";
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    } catch {
      return "-";
    }
  };

  const handleExportCSV = () => {
    if (!records.length) {
      toast.info("No records to export.");
      return;
    }
    const headers = ["Date", "Status", "Clock In", "Clock Out", "Duration"];
    const rows = records.map((r) => [
      r.date || "",
      r.status || "",
      r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : "",
      r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : "",
      calculateDuration(r.clockIn, r.clockOut),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance-summary-${employeeId || "export"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance summary exported as CSV.");
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#65766b] transition-colors hover:text-[#176b50]"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-9 gap-1.5 rounded-xl border-[#d3ded5] text-xs font-semibold text-[#176b50] hover:bg-[#e8f1ec]"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold text-[#176b50]">
            <FileSpreadsheet className="size-3.5" />
            Employee Records
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17261f]">
            Attendance Summary
          </h1>
          <p className="mt-1 text-sm text-[#6c7d71]">
            View and filter your attendance shift logs by date range.
          </p>
        </div>

        <SummaryFilterCard
          startDate={startDate}
          endDate={endDate}
          isFetching={isFetching}
          activePreset={activePreset}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilter={handleApplyFilter}
          onPreset={handlePreset}
        />
        <SummaryStatsCards totalDays={totalDays} records={records} />
        <AttendanceEntriesCard
          records={records}
          isFetching={isFetching}
          onRefresh={() => handleManualFetch(startDate, endDate)}
          calculateDuration={calculateDuration}
        />
      </main>
    </div>
  );
}
