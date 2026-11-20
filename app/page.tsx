"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [token, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
      <Loader2 className="size-8 animate-spin text-[#176b50]" />
    </div>
  );
}
