import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./(component)/login-form";
import { Card } from "@/components/ui/card";

const attendance = [
  { initials: "AM", name: "Alex Morgan", team: "Design", time: "08:42 AM" },
  { initials: "JL", name: "Jamie Lee", team: "Engineering", time: "08:51 AM" },
  { initials: "SK", name: "Sam Kim", team: "Operations", time: "09:03 AM" },
];

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-[#f3f5f1] p-3 text-[#17261f] sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100svh-1.5rem)] max-w-[1440px] overflow-hidden rounded-[26px] bg-white shadow-[0_24px_80px_-36px_rgba(27,55,40,0.28)] sm:min-h-[calc(100svh-2.5rem)] sm:rounded-[30px] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1.04fr]">
        <section className="flex flex-col px-6 py-7 sm:px-10 sm:py-9 lg:px-14 xl:px-20">
          <Link
            aria-label="Kantor home"
            className="flex w-fit items-center gap-2.5"
            href="/login"
          >
            <span className="flex size-10 items-center justify-center rounded-[13px] bg-[#176b50] text-white shadow-sm">
              <CalendarDays aria-hidden="true" className="size-5" />
            </span>
            <span className="text-[19px] font-semibold tracking-[-0.04em]">
              kantor
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-center py-12 sm:py-16 lg:py-10">
            <div className="w-full max-w-[390px]">
              <div className="mb-9">
                <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#668273] uppercase">
                  Your workspace
                </p>
                <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.045em] text-[#17261f] sm:text-[36px]">
                  Welcome back
                </h1>
                <p className="mt-2 text-[15px] leading-6 text-[#78847d]">
                  Sign in to manage your day and keep your team in sync.
                </p>
              </div>

              <LoginForm />

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#8a958e]">
                <ShieldCheck aria-hidden="true" className="size-4 text-[#72927f]" />
                <span>Your workspace is private and secure</span>
              </div>
            </div>
          </div>

          <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#edf0ec] pt-5 text-xs text-[#929c95] sm:flex-row">
            <span>© 2026 Kantor, Inc.</span>
            <div className="flex items-center gap-5">
              <span>Need help? Contact your workspace administrator.</span>
            </div>
          </footer>
        </section>

        <aside className="relative hidden min-h-[680px] overflow-hidden bg-[#123e30] px-10 py-10 text-white sm:block sm:px-12 sm:py-12 lg:px-14 xl:px-[72px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_15%,rgba(126,185,142,0.24),transparent_38%),radial-gradient(ellipse_at_4%_95%,rgba(78,141,108,0.24),transparent_40%)]"
          />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />

          <div className="relative flex h-full min-h-[600px] flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-[0.2em] text-[#c2d7c9] uppercase">
                People, in rhythm
              </span>
              <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
                <ArrowUpRight aria-hidden="true" className="size-4 text-[#d3e4d8]" />
              </span>
            </div>

            <div className="mt-12 max-w-[480px]">
              <h2 className="text-[clamp(2.5rem,4vw,4rem)] leading-[1.04] font-medium tracking-[-0.055em] text-[#f4f7f2]">
                Make every
                <br />
                workday count.
              </h2>
              <p className="mt-5 max-w-[390px] text-[15px] leading-7 text-[#c0d2c5]">
                A calmer way to handle attendance, schedules, and the people
                who make your business move.
              </p>
            </div>

            <div className="relative mx-auto mt-12 w-full max-w-[500px] flex-1">
              <div
                aria-hidden="true"
                className="absolute top-12 left-1/2 size-[390px] -translate-x-1/2 rounded-full border border-white/[0.08]"
              />
              <div
                aria-hidden="true"
                className="absolute top-[88px] left-1/2 size-[310px] -translate-x-1/2 rounded-full border border-white/[0.08]"
              />

              <Card className="absolute top-0 left-1/2 w-full max-w-[440px] -translate-x-1/2 rotate-[-2deg] gap-0 rounded-[20px] border-0 bg-[#f8faf7] p-4 text-[#1d3328] shadow-[0_28px_70px_-22px_rgba(0,0,0,0.55)] ring-white/15 sm:p-5">
                <div className="flex items-center justify-between border-b border-[#e9eee9] pb-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.02em]">Today&apos;s attendance</p>
                    <p className="mt-1 text-[11px] text-[#87948b]">Thursday, November 19</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#e7f3e9] px-2.5 py-1 text-[10px] font-semibold text-[#34714d]">
                    <span className="size-1.5 rounded-full bg-[#4d9b66]" />
                    Live
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4 py-4">
                  <div>
                    <p className="text-[11px] font-medium text-[#89958d]">Team present</p>
                    <p className="mt-1 text-[30px] leading-none font-semibold tracking-[-0.06em]">
                      24
                      <span className="ml-1 text-sm font-medium tracking-normal text-[#9ba59e]">
                        / 28
                      </span>
                    </p>
                  </div>
                  <div className="flex h-12 items-end gap-1.5" aria-label="Attendance activity chart">
                    {[36, 54, 42, 72, 58, 88, 66, 100, 76, 91, 60, 82].map(
                      (height, index) => (
                        <span
                          key={index}
                          className={`w-2 rounded-t-sm ${index === 7 ? "bg-[#348260]" : "bg-[#d6e5d9]"}`}
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {attendance.map((person, index) => (
                    <div
                      className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5"
                      key={person.initials}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex size-8 items-center justify-center rounded-full text-[10px] font-semibold ${index === 0 ? "bg-[#e6ede7] text-[#557460]" : index === 1 ? "bg-[#f1e9dd] text-[#9c7142]" : "bg-[#e7eafa] text-[#6570a2]"}`}
                        >
                          {person.initials}
                        </span>
                        <span>
                          <span className="block text-xs font-semibold">{person.name}</span>
                          <span className="mt-0.5 block text-[10px] text-[#929d95]">
                            {person.team}
                          </span>
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#718078]">
                        <Check aria-hidden="true" className="size-3 text-[#43815b]" />
                        {person.time}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="absolute right-0 bottom-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#285844]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:right-[-8px]">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#d1e5d3] text-[#286344]">
                  <UsersRound aria-hidden="true" className="size-[18px]" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold text-white">Your team, at a glance</span>
                  <span className="mt-0.5 block text-[10px] text-[#c2d8c8]">All in one place</span>
                </span>
              </div>

              <div className="absolute bottom-8 left-0 flex items-center gap-2 rounded-full border border-white/15 bg-[#285844]/90 px-3.5 py-2 text-[10px] font-medium text-[#e2eee5] shadow-xl backdrop-blur-md">
                <Clock3 aria-hidden="true" className="size-3.5 text-[#b8d5be]" />
                A little more time for what matters
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-[#b7cebf]">
              <span>Built for better workdays</span>
              <span className="font-medium tracking-wide">KANTOR&nbsp; / &nbsp;01</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
