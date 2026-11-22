export interface EmployeeProfile {
  employeeId: string;
  name: string;
  email: string;
  role?: string;
  photo?: string | null;
  phoneNumber?: string | null;
  updatedAt?: string;
}

export interface UpdateEmployeeProfilePayload {
  currentPassword: string;
  photo?: string;
  phoneNumber?: string;
  newPassword?: string;
}
