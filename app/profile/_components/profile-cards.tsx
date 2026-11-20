"use client";

import {Eye, EyeOff, Loader2, LockKeyhole, Mail, Phone, ShieldCheck, User,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import type {ProfileEditCardProps, ProfileOverviewCardProps,} from "@/app/profile/_types/profile.type";
import {AvatarUploadField} from "./avatar-upload-field";

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
    return (
        <div className="rounded-2xl border border-[#e5eae5] bg-white p-6 shadow-xs">
            <div className="flex flex-col items-center text-center">
                <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8f1ec] bg-[#f8faf8]">
                    {profile?.photo ? (
                        <img
                            src={profile.photo}
                            alt={profile?.name || "Employee avatar"}
                            className="size-full object-cover"
                        />
                    ) : (
                        <User className="size-10 text-[#98a49c]" />
                    )}
                </div>

          <h2 className="mt-4 text-lg font-bold text-[#17261f]">
            {profile?.name || "Employee"}
          </h2>
          <p className="mt-0.5 text-xs text-[#6c7d71]">{profile?.email}</p>

          {profile?.employeeId && (
              <span className="mt-3 inline-flex items-center rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold text-[#176b50]">
            ID: {profile.employeeId}
          </span>
          )}
        </div>

        <div className="mt-6 space-y-3 border-t border-[#e5eae5] pt-5 text-xs">
          <div className="flex items-center justify-between text-[#6c7d71]">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Mail className="size-3.5 text-[#98a49c]" />
            Email
          </span>
            <span className="font-semibold text-[#17261f]">
            {profile?.email || "—"}
          </span>
          </div>

          <div className="flex items-center justify-between text-[#6c7d71]">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Phone className="size-3.5 text-[#98a49c]" />
            Phone
          </span>
            <span className="font-semibold text-[#17261f]">
            {profile?.phoneNumber || "Not set"}
          </span>
          </div>
        </div>
      </div>
  );
}

export function ProfileSecurityNote() {
  return (
      <div className="rounded-2xl border border-[#d3ded5] bg-[#e8f1ec]/60 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#176b50] text-white">
            <ShieldCheck className="size-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-[#17261f]">
              Security Verification
            </h3>
            <p className="text-xs leading-relaxed text-[#53665a]">
              Your current password is required to confirm any changes to your
              profile photo, contact number, or login credentials.
            </p>
          </div>
        </div>
      </div>
  );
}

export function ProfileEditCard({
                                  profile,
                                  photo,
                                  phoneNumber,
                                  currentPassword,
                                  newPassword,
                                  confirmPassword,
                                  showCurrentPassword,
                                  showNewPassword,
                                  isSubmitting,
                                  onPhotoChange,
                                  onPhoneNumberChange,
                                  onCurrentPasswordChange,
                                  onNewPasswordChange,
                                  onConfirmPasswordChange,
                                  onToggleCurrentPassword,
                                  onToggleNewPassword,
                                  onSubmit,
                                }: ProfileEditCardProps) {
  return (
      <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl border border-[#e5eae5] bg-white p-6 shadow-xs sm:p-8"
      >
        <div>
          <h2 className="text-lg font-bold text-[#17261f]">Personal Details</h2>
          <p className="mt-0.5 text-xs text-[#6c7d71]">
            Update your profile photo and contact information.
          </p>
        </div>

        <AvatarUploadField
            photo={photo}
            initialPhoto={profile?.photo || ""}
            name={profile?.name}
            onChange={onPhotoChange}
            disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[13px] text-[#35463c]" htmlFor="full-name">
              Full name
            </Label>
            <Input
                id="full-name"
                value={profile?.name || ""}
                disabled
                className="h-11 rounded-xl border-[#e5eae5] bg-[#f8faf8] text-sm text-[#6c7d71]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] text-[#35463c]" htmlFor="phone-number">
              Phone number
            </Label>
            <div className="relative">
              <Phone
                  aria-hidden="true"
                  className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#98a49c]"
              />
              <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={phoneNumber}
                  onChange={(e) => onPhoneNumberChange(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border-[#e5eae5] bg-white pl-10 text-sm placeholder:text-[#a3ada6] focus-visible:border-[#5b997c] focus-visible:ring-[#5b997c]/15"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 border-t border-[#e5eae5] pt-6">
          <div>
            <h3 className="text-base font-bold text-[#17261f]">
              Password & Authentication
            </h3>
            <p className="mt-0.5 text-xs text-[#6c7d71]">
              Leave new password blank if you only want to update your photo or
              phone number.
            </p>
          </div>

          <div className="space-y-2">
            <Label
                className="text-[13px] text-[#35463c]"
                htmlFor="current-password"
            >
              Current password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <LockKeyhole
                  aria-hidden="true"
                  className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#98a49c]"
              />
              <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password to authorize changes"
                  value={currentPassword}
                  onChange={(e) => onCurrentPasswordChange(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-11 rounded-xl border-[#e5eae5] bg-white pr-11 pl-10 text-sm placeholder:text-[#a3ada6] focus-visible:border-[#5b997c] focus-visible:ring-[#5b997c]/15"
              />
              <button
                  type="button"
                  onClick={onToggleCurrentPassword}
                  disabled={isSubmitting}
                  aria-label={
                    showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                  }
                  className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#98a49c] transition-colors hover:bg-[#f1f4f0] hover:text-[#53665a]"
              >
                {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                  className="text-[13px] text-[#35463c]"
                  htmlFor="new-password"
              >
                New password
              </Label>
              <div className="relative">
                <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 12 characters"
                    value={newPassword}
                    onChange={(e) => onNewPasswordChange(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 rounded-xl border-[#e5eae5] bg-white pr-11 text-sm placeholder:text-[#a3ada6] focus-visible:border-[#5b997c] focus-visible:ring-[#5b997c]/15"
                />
                <button
                    type="button"
                    onClick={onToggleNewPassword}
                    disabled={isSubmitting}
                    aria-label={
                      showNewPassword ? "Hide new password" : "Show new password"
                    }
                    className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#98a49c] transition-colors hover:bg-[#f1f4f0] hover:text-[#53665a]"
                >
                  {showNewPassword ? (
                      <EyeOff className="size-4" />
                  ) : (
                      <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                  className="text-[13px] text-[#35463c]"
                  htmlFor="confirm-password"
              >
                Confirm new password
              </Label>
              <Input
                  id="confirm-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border-[#e5eae5] bg-white text-sm placeholder:text-[#a3ada6] focus-visible:border-[#5b997c] focus-visible:ring-[#5b997c]/15"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-[#176b50] px-6 text-sm font-semibold text-white shadow-[0_6px_14px_-7px_rgba(23,107,80,0.7)] transition-all hover:bg-[#12583f] disabled:opacity-70"
          >
            {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving Changes...
                </>
            ) : (
                "Save Changes"
            )}
          </Button>
        </div>
      </form>
  );
}