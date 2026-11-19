import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EmployeeProfile } from "@/lib/api/employee/dto";

export function DashboardProfileCard({ user }: { user: EmployeeProfile | null }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Card className="rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#edf0ec] pb-4">
        <h2 className="text-base font-semibold text-[#17261f]">My Profile</h2>
        <Link
          href="/profile"
          className="text-xs font-semibold text-[#176b50] hover:underline"
        >
          Edit Profile
        </Link>
      </div>

      <div className="mt-5 flex flex-col items-center text-center">
        <div className="relative mb-3 flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-[#e3ece6] text-2xl font-bold text-[#176b50] shadow-inner">
          {user?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photo}
              alt={user.name || "Avatar"}
              className="size-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#17261f]">
          {user?.name || "Employee"}
        </h3>
        <p className="text-xs text-[#738478]">{user?.email}</p>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold text-[#176b50] capitalize">
          <Shield className="size-3.5" />
          {user?.role || "Employee"}
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-[#f7f9f7] p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#6d7e73]">Employee ID</span>
          <span className="font-mono font-semibold text-[#17261f]">
            #{user?.employeeId || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6d7e73]">Phone</span>
          <span className="font-medium text-[#17261f]">
            {user?.phoneNumber || "Not provided"}
          </span>
        </div>
      </div>

      <Link href="/profile" className="mt-5 block">
        <Button
          variant="outline"
          className="h-10 w-full rounded-xl border-[#d3ded5] text-xs font-semibold text-[#176b50] hover:bg-[#e8f1ec]"
        >
          Manage Profile &amp; Password
        </Button>
      </Link>
    </Card>
  );
}
