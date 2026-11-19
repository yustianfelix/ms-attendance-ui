import type { SyntheticEvent } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Filter,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AttendanceRecord } from "@/lib/api/attendance/dto";

export type SummaryPreset = "week" | "month" | "last30" | "all";

interface SummaryFilterCardProps {
  startDate: string;
  endDate: string;
  isFetching: boolean;
  activePreset: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApplyFilter: (event?: SyntheticEvent<HTMLFormElement>) => void;
  onPreset: (preset: SummaryPreset) => void;
}

export function SummaryFilterCard({
  startDate,
  endDate,
  isFetching,
  activePreset,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onPreset,
}: SummaryFilterCardProps) {
  const presets: { id: SummaryPreset; label: string }[] = [
    { id: "all", label: "All Time" },
    { id: "month", label: "This Month" },
    { id: "week", label: "This Week" },
    { id: "last30", label: "Last 30 Days" },
  ];

  return (
    <Card className="mb-8 rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0ec] pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#17261f]">
          <Filter className="size-4 text-[#176b50]" />
          <span>Filter Range</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPreset(preset.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${activePreset === preset.id
                ? "bg-[#176b50] text-white"
                : "bg-[#f1f5f2] text-[#5c6e62] hover:bg-[#e6eee8] hover:text-[#17261f]"
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={onApplyFilter}
        className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end"
      >
        <div className="space-y-1.5 sm:col-span-5">
          <Label
            className="text-xs font-semibold text-[#54675b]"
            htmlFor="startDate"
          >
            Date From
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="h-11 rounded-xl border-[#dce5df] bg-white text-sm"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-5">
          <Label
            className="text-xs font-semibold text-[#54675b]"
            htmlFor="endDate"
          >
            Date To
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="h-11 rounded-xl border-[#dce5df] bg-white text-sm"
          />
        </div>

        <div className="flex gap-2 sm:col-span-2">
          <Button
            type="submit"
            disabled={isFetching}
            className="h-11 w-full rounded-xl bg-[#176b50] text-xs font-semibold text-white hover:bg-[#12583f]"
          >
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-1.5 size-3.5" />
                Filter
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function SummaryStatsCards({
  totalDays,
  records,
}: {
  totalDays: number;
  records: AttendanceRecord[];
}) {
  const stats = [
    {
      label: "Total Shift Days",
      value: totalDays || records.length,
      valueClassName: "text-[#17261f]",
    },
    {
      label: "Recorded Clock-Ins",
      value: records.filter((record) => record.clockIn).length,
      valueClassName: "text-[#176b50]",
    },
    {
      label: "Completed Shifts",
      value: records.filter((record) => record.clockIn && record.clockOut)
        .length,
      valueClassName: "text-[#2a4d3a]",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="rounded-2xl border border-[#e5eae5] bg-white p-5 shadow-sm"
        >
          <span className="text-xs font-medium text-[#718277]">{stat.label}</span>
          <p className={`mt-1 text-2xl font-bold ${stat.valueClassName}`}>
            {stat.value}
          </p>
        </Card>
      ))}
    </div>
  );
}

interface AttendanceEntriesCardProps {
  records: AttendanceRecord[];
  isFetching: boolean;
  onRefresh: () => void;
  calculateDuration: (inTime?: string, outTime?: string | null) => string;
}

export function AttendanceEntriesCard({
  records,
  isFetching,
  onRefresh,
  calculateDuration,
}: AttendanceEntriesCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-[#e5eae5] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#edf0ec] px-6 py-4">
        <h2 className="text-base font-semibold text-[#17261f]">
          Attendance Entries
        </h2>
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#176b50] hover:underline"
        >
          <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#69796e]">
          <Loader2 className="size-8 animate-spin text-[#176b50]" />
          <p className="mt-2 text-xs font-medium">
            Fetching attendance records...
          </p>
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#edf4ef] text-[#176b50]">
            <Calendar className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[#17261f]">
            No attendance records found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-[#738478]">
            There are no attendance entries recorded for the selected date range.
            Try choosing another range or record an action on the Clock In/Out
            page.
          </p>
          <Link href="/attendance" className="mt-5">
            <Button
              className="h-10 rounded-xl bg-[#176b50] text-xs font-semibold text-white hover:bg-[#12583f]">
              Record Today&apos;s Attendance
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#17261f]">
            <thead
              className="bg-[#f9faf9] text-[11px] font-semibold tracking-wider text-[#6b7b71] uppercase">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Clock In</th>
                <th className="px-6 py-3.5">Clock Out</th>
                <th className="px-6 py-3.5">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ec]">
              {records.map((record) => (
                <tr
                  key={record.uuid || record.date}
                  className="transition-colors hover:bg-[#f6f9f7]"
                >
                  <td className="px-6 py-4 font-semibold text-[#17261f]">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-[#899a8f]" />
                      <span>{record.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${record.clockOut
                        ? "bg-emerald-50 text-emerald-700"
                        : record.clockIn
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {record.status ||
                        (record.clockOut ? "Completed" : "Clocked In")}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#2a3c30]">
                    {record.clockIn ? (
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-[#176b50]" />
                        {new Date(record.clockIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span className="text-[#96a59b]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#2a3c30]">
                    {record.clockOut ? (
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-amber-700" />
                        {new Date(record.clockOut).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span
                        className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-sans font-medium text-amber-800">
                        Active Shift
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-[#176b50]">
                    {calculateDuration(record.clockIn, record.clockOut)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
