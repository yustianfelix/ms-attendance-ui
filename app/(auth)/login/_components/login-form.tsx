"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await login(email.trim(), password);
      toast.success(
          `Welcome back, ${result.user.name || result.user.email}! Logged in successfully.`
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      const errText =
          err instanceof Error ? err.message : "Failed to sign in. Please try again.";
      setErrorMessage(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <form className="space-y-5" onSubmit={handleSubmit}>
        {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs text-red-700">
              <p className="font-semibold">Sign in failed</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
        )}

        <div className="space-y-2">
          <Label className="text-[13px] text-[#35463c]" htmlFor="email">
            Work email
          </Label>
          <div className="relative">
            <Mail
                aria-hidden="true"
                className="absolute top-1/2 left-4 size-[17px] -translate-y-1/2 text-[#98a49c]"
            />
            <Input
                autoComplete="email"
                className="h-12 rounded-xl border-[#e5eae5] bg-white pl-11 text-sm placeholder:text-[#a3ada6] focus-visible:border-[#5b997c] focus-visible:ring-[#5b997c]/15"
                disabled={isSubmitting}
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[13px] text-[#35463c]" htmlFor="password">
              Password
            </Label>
            <button
                className="text-xs font-medium text-[#347a5a] transition-colors hover:text-[#175b3f] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#347a5a]"
                onClick={() =>
                    toast.info("Please contact your workspace administrator to reset your password.")
                }
                type="button"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <LockKeyhole
                aria-hidden="true"
                className="absolute top-1/2 left-4 size-[17px] -translate-y-1/2 text-[#98a49c]"
            />
            <Input
                autoComplete="current-password"
                className="h-12 rounded-xl border-[#e5eae5] bg-white pr-12 pl-11 text-sm placeholder:text-[#a3ada6] focus-visible:border-[#5b997c] focus-visible:ring-[#5b997c]/15"
                disabled={isSubmitting}
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                type={showPassword ? "text" : "password"}
                value={password}
            />
            <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#98a49c] transition-colors hover:bg-[#f1f4f0] hover:text-[#53665a] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#347a5a]"
                disabled={isSubmitting}
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
            >
              {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-[17px]" />
              ) : (
                  <Eye aria-hidden="true" className="size-[17px]" />
              )}
            </button>
          </div>
        </div>

        <Button
            className="h-12 w-full rounded-xl bg-[#176b50] text-sm font-semibold text-white shadow-[0_6px_14px_-7px_rgba(23,107,80,0.7)] transition-all hover:bg-[#12583f] hover:shadow-[0_8px_18px_-8px_rgba(23,107,80,0.8)] disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
        >
          {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
          ) : (
              <>
                Sign in
                <span aria-hidden="true" className="ml-1 inline-flex">
              <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M4.167 10h11.666m0 0-5-5m5 5-5 5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                />
              </svg>
            </span>
              </>
          )}
        </Button>
      </form>
  );
}
