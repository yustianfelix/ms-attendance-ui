import type { SyntheticEvent } from "react";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeProfile } from "@/lib/api/employee/dto";

export function ProfileOverviewCard({
  profile,
  photo,
}: {
  profile: EmployeeProfile | null;
  photo: string;
}) {
  const initials = profile?.name
    ? profile.name
      .split(" ")
      .map((namePart) => namePart[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <Card className="rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div
          className="relative mb-4 flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-[#e3ece6] text-3xl font-bold text-[#176b50] shadow-sm">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={profile?.name || "Profile"}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <h2 className="text-xl font-bold text-[#17261f]">
          {profile?.name || "Employee"}
        </h2>
        <p className="text-xs text-[#75867a]">{profile?.email}</p>

        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold text-[#176b50] capitalize">
          <Shield className="size-3.5" />
          {profile?.role || "Employee"}
        </div>
      </div>

      <div className="mt-6 space-y-3.5 border-t border-[#edf0ec] pt-5 text-xs">
        <div>
          <span className="block font-medium text-[#738478]">Employee ID</span>
          <span className="font-mono text-sm font-semibold text-[#17261f]">
            #{profile?.employeeId || "N/A"}
          </span>
        </div>

        <div>
          <span className="block font-medium text-[#738478]">Email</span>
          <span className="text-sm font-medium text-[#17261f]">
            {profile?.email}
          </span>
        </div>

        <div>
          <span className="block font-medium text-[#738478]">Phone Number</span>
          <span className="text-sm font-medium text-[#17261f]">
            {profile?.phoneNumber || "Not set"}
          </span>
        </div>

        {profile?.updatedAt && (
          <div>
            <span className="block font-medium text-[#738478]">Last Updated</span>
            <span className="text-xs text-[#738478]">
              {new Date(profile.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

export function ProfileSecurityNote() {
  return (
    <Card className="rounded-2xl border border-dashed border-[#ccd9cf] bg-[#f7f9f7] p-5 text-xs text-[#526358]">
      <p className="font-semibold text-[#17261f]">Security Note</p>
      <p className="mt-1 leading-relaxed">
        Changes to phone number, profile photo, or password require your current
        password for authentication.
      </p>
    </Card>
  );
}

interface ProfileEditCardProps {
  profile: EmployeeProfile | null;
  phoneNumber: string;
  photo: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  isSubmitting: boolean;
  onPhoneNumberChange: (value: string) => void;
  onPhotoChange: (value: string) => void;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onToggleCurrentPassword: () => void;
  onToggleNewPassword: () => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

export function ProfileEditCard({
  profile,
  phoneNumber,
  photo,
  currentPassword,
  newPassword,
  confirmPassword,
  showCurrentPassword,
  showNewPassword,
  isSubmitting,
  onPhoneNumberChange,
  onPhotoChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onSubmit,
}: ProfileEditCardProps) {
  return (
    <Card className="rounded-3xl border border-[#e5eae5] bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-[#17261f]">
        Edit Profile Information
      </h2>
      <p className="mt-1 text-xs text-[#718078]">
        Update your contact details or change your password.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#526559]">Full Name</Label>
            <div className="relative">
              <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#96a69c]" />
              <Input
                disabled
                value={profile?.name || ""}
                className="h-11 rounded-xl border-[#e5eae5] bg-[#f5f8f5] pl-10 text-sm text-[#738478]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#526559]">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#96a69c]" />
              <Input
                disabled
                value={profile?.email || ""}
                className="h-11 rounded-xl border-[#e5eae5] bg-[#f5f8f5] pl-10 text-sm text-[#738478]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              className="text-xs font-semibold text-[#35463c]"
              htmlFor="phone"
            >
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#96a69c]" />
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(event) => onPhoneNumberChange(event.target.value)}
                placeholder="+62 812-3456-7890"
                className="h-11 rounded-xl border-[#dce5df] bg-white pl-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              className="text-xs font-semibold text-[#35463c]"
              htmlFor="photo"
            >
              Photo URL
            </Label>
            <div className="relative">
              <ImageIcon className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#96a69c]" />
              <Input
                id="photo"
                type="url"
                value={photo}
                onChange={(event) => onPhotoChange(event.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="h-11 rounded-xl border-[#dce5df] bg-white pl-10 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5eae5] bg-[#fafcfa] p-5">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="size-4 text-[#176b50]" />
            <h3 className="text-sm font-bold text-[#17261f]">
              Change Password (Optional)
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                className="text-xs font-semibold text-[#35463c]"
                htmlFor="newPassword"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#96a69c]" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => onNewPasswordChange(event.target.value)}
                  placeholder="Min. 12 characters"
                  className="h-11 rounded-xl border-[#dce5df] bg-white pr-10 pl-10 text-sm"
                />
                <button
                  type="button"
                  onClick={onToggleNewPassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#98a59c] hover:text-[#17261f]"
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#728377]">
                Must be at least 12 characters long
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-xs font-semibold text-[#35463c]"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#96a69c]" />
                <Input
                  id="confirmPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    onConfirmPasswordChange(event.target.value)
                  }
                  placeholder="Re-type new password"
                  className="h-11 rounded-xl border-[#dce5df] bg-white pl-10 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <div className="space-y-1.5">
            <Label
              className="text-xs font-semibold text-amber-900"
              htmlFor="currentPassword"
            >
              Current Password (Required to save changes) *
            </Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-amber-700" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) =>
                  onCurrentPasswordChange(event.target.value)
                }
                placeholder="Enter your current password"
                required
                className="h-11 rounded-xl border-amber-200 bg-white pr-10 pl-10 text-sm focus-visible:border-[#176b50]"
              />
              <button
                type="button"
                onClick={onToggleCurrentPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-amber-700 hover:text-amber-900"
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-amber-800">
              Your current password is required by the Gateway to authenticate
              this update.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !currentPassword}
            className="h-11 min-w-[160px] rounded-xl bg-[#176b50] text-sm font-semibold text-white shadow-sm hover:bg-[#12583f] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
