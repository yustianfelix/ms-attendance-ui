import type { SyntheticEvent } from "react";
import type { EmployeeProfile } from "@/lib/api/employee/dto/employee.dto";

export interface AvatarUploadFieldProps {
    photo: string;
    initialPhoto?: string;
    name?: string;
    onChange: (base64: string) => void;
    disabled?: boolean;
}

export interface ProfileOverviewCardProps {
    profile: EmployeeProfile | null;
    photo: string;
}

export interface ProfileEditCardProps {
    profile: EmployeeProfile | null;
    photo: string;
    phoneNumber: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    showCurrentPassword: boolean;
    showNewPassword: boolean;
    isSubmitting: boolean;
    onPhotoChange: (photo: string) => void;
    onPhoneNumberChange: (value: string) => void;
    onCurrentPasswordChange: (value: string) => void;
    onNewPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onToggleCurrentPassword: () => void;
    onToggleNewPassword: () => void;
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
}