import type { EmployeeProfile } from "../../employee/dto/employee.dto";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  access_token?: string;
  data?: {
    employeeId: string;
    name: string;
    email: string;
    role: string;
    photo?: string | null;
    phoneNumber?: string | null;
    access_token?: string;
  };
}

export interface LoginResult {
  token: string;
  user: EmployeeProfile;
  raw: LoginResponse;
}
