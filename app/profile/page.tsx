"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/api/employee/employee";
import type { EmployeeProfile } from "@/lib/api/employee/dto";
import { useAuth } from "@/lib/auth-context";
import {
  ProfileEditCard,
  ProfileOverviewCard,
  ProfileSecurityNote,
} from "./_components/profile-cards";

export default function ProfilePage() {
  const { user, isLoading, updateUser, refreshProfile } = useAuth();

  const [profile, setProfile] = useState<EmployeeProfile | null>(() => user);
  const [phoneNumber, setPhoneNumber] = useState<string>(() => user?.phoneNumber || "");
  const [photo, setPhoto] = useState<string>(() => user?.photo || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeProfile = profile || user;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await refreshProfile();
      if (refreshed) {
        setProfile(refreshed);
        setPhoneNumber(refreshed.phoneNumber || "");
        setPhoto(refreshed.photo || "");
        toast.success("Profile refreshed from server.");
      }
    } catch {
      toast.error("Failed to refresh profile.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!activeProfile?.employeeId) {
      toast.error("No active user session.");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required to save changes.");
      return;
    }

    if (newPassword && newPassword.length < 12) {
      toast.error("New password must be at least 12 characters long.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updated = await updateProfile(activeProfile.employeeId, {
        currentPassword,
        phoneNumber: phoneNumber || undefined,
        photo: photo || undefined,
        newPassword: newPassword || undefined,
      });

      updateUser(updated);
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Profile successfully updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
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

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="h-9 gap-1.5 rounded-xl border-[#d3ded5] text-xs font-semibold text-[#176b50] hover:bg-[#e8f1ec]"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold text-[#176b50]">
            <User className="size-3.5" />
            User Settings
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17261f]">
            Employee Profile
          </h1>
          <p className="mt-1 text-sm text-[#6c7d71]">
            View and update your personal details and security credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Overview Card */}
          <div className="space-y-6 lg:col-span-1">
            <ProfileOverviewCard profile={activeProfile} photo={photo} />
            <ProfileSecurityNote />
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <ProfileEditCard
              profile={activeProfile}
              phoneNumber={phoneNumber}
              photo={photo}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showCurrentPassword={showCurrentPassword}
              showNewPassword={showNewPassword}
              isSubmitting={isSubmitting}
              onPhoneNumberChange={setPhoneNumber}
              onPhotoChange={setPhoto}
              onCurrentPasswordChange={setCurrentPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onToggleCurrentPassword={() =>
                setShowCurrentPassword((visible) => !visible)
              }
              onToggleNewPassword={() =>
                setShowNewPassword((visible) => !visible)
              }
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
