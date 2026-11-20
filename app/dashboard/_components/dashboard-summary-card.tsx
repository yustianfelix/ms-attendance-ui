import Link from "next/link";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardSummaryCard({ totalDays }: { totalDays: number | null }) {
  return (
    <Card className="rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#edf5f0] text-[#176b50]">
            <FileSpreadsheet className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#17261f]">
              Attendance Summary &amp; History
            </h2>
            <p className="text-xs text-[#718078]">
              Track shifts and filter by date range
            </p>
          </div>
        </div>

        <Link href="/summary">
          <Button
            variant="ghost"
            className="h-9 rounded-xl text-xs font-semibold text-[#176b50] hover:bg-[#e8f1ec]"
          >
            View All
            <ArrowRight className="ml-1 size-3.5" />
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-[#d8e2da] bg-[#fafbfa] p-5 sm:flex-row">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#176b50]/10 text-xl font-bold text-[#176b50]">
            {totalDays ?? "0"}
          </span>
          <div>
            <p className="text-sm font-semibold text-[#17261f]">
              Total Days Tracked
            </p>
            <p className="text-xs text-[#718078]">
              Complete historical attendance entries
            </p>
          </div>
        </div>

        <Link href="/summary">
          <Button className="h-9 rounded-xl bg-[#176b50] text-xs font-semibold text-white hover:bg-[#12583f]">
            Filter by Date Range
          </Button>
        </Link>
      </div>
    </Card>
  );
}
