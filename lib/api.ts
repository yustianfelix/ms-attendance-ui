export const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL?.replace(/\/$/, '') || 'http://localhost:3040';

export interface EmployeeProfile {
  employeeId: string;
  name: string;
  email: string;
  role?: string;
  photo?: string | null;
  phoneNumber?: string | null;
  updatedAt?: string;
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

export interface UpdateEmployeeProfilePayload {
  currentPassword: string;
  photo?: string;
  phoneNumber?: string;
  newPassword?: string;
}

export interface AttendanceRecord {
  uuid: string;
  employeeId: string;
  date: string;
  status: string;
  clockIn: string;
  clockOut: string | null;
}

export interface AttendanceSummaryData {
  employee_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  attendances: AttendanceRecord[];
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
}

const TOKEN_KEY = 'kantor_auth_token';
const USER_KEY = 'kantor_auth_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): EmployeeProfile | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as EmployeeProfile;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: EmployeeProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const url = `${GATEWAY_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    if (typeof data === 'object' && data !== null) {
      if ('message' in data) {
        errorMsg = Array.isArray(data.message)
          ? data.message.join(', ')
          : String(data.message);
      } else if ('error' in data) {
        errorMsg = String(data.error);
      }
    } else if (typeof data === 'string' && data) {
      errorMsg = data;
    }
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  async login(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: EmployeeProfile;
    raw: LoginResponse;
  }> {
    const response = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const token =
      response.access_token ||
      (response.data && response.data.access_token) ||
      '';

    if (!token) {
      throw new Error('Authentication succeeded but no access token was returned.');
    }

    const jwtPayload = parseJwt(token);
    const sub = (jwtPayload?.sub as string) || '';

    const user: EmployeeProfile = {
      employeeId: response.data?.employeeId ?? sub ?? '',
      name: response.data?.name ?? (jwtPayload?.name as string) ?? credentials.email,
      email: response.data?.email ?? (jwtPayload?.email as string) ?? credentials.email,
      role: response.data?.role ?? (jwtPayload?.role as string) ?? 'employee',
      photo: response.data?.photo ?? null,
      phoneNumber: response.data?.phoneNumber ?? null,
    };

    setAuthSession(token, user);
    return { token, user, raw: response };
  },

  async getProfile(employeeId: string): Promise<EmployeeProfile> {
    const res = await request<ApiResponse<EmployeeProfile>>(
      `/employees/${encodeURIComponent(employeeId)}/profile`,
      { method: 'GET' }
    );
    const profile = res.data ?? (res as unknown as EmployeeProfile);
    return profile;
  },

  async updateProfile(
    employeeId: string,
    payload: UpdateEmployeeProfilePayload
  ): Promise<EmployeeProfile> {
    const cleanedPayload: UpdateEmployeeProfilePayload = {
      currentPassword: payload.currentPassword,
    };
    if (payload.photo !== undefined && payload.photo.trim() !== '') {
      cleanedPayload.photo = payload.photo.trim();
    }
    if (payload.phoneNumber !== undefined && payload.phoneNumber.trim() !== '') {
      cleanedPayload.phoneNumber = payload.phoneNumber.trim();
    }
    if (payload.newPassword !== undefined && payload.newPassword.trim() !== '') {
      cleanedPayload.newPassword = payload.newPassword;
    }

    const res = await request<ApiResponse<EmployeeProfile>>(
      `/employees/${encodeURIComponent(employeeId)}/profile`,
      {
        method: 'PATCH',
        body: JSON.stringify(cleanedPayload),
      }
    );

    const updatedProfile = res.data ?? (res as unknown as EmployeeProfile);

    // Update stored user details if currently logged in user
    const currentUser = getStoredUser();
    if (currentUser && currentUser.employeeId === employeeId) {
      const mergedUser = { ...currentUser, ...updatedProfile };
      const token = getStoredToken();
      if (token) {
        setAuthSession(token, mergedUser);
      }
    }

    return updatedProfile;
  },

  async recordAttendance(payload: {
    employee_id: string;
    action: 'clock-in' | 'clock-out';
    date: string;
  }): Promise<ApiResponse<AttendanceRecord>> {
    return request<ApiResponse<AttendanceRecord>>('/attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAttendanceSummary(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceSummaryData> {
    const query = new URLSearchParams();
    query.set('employee_id', employeeId);
    if (startDate) query.set('start_date', startDate);
    if (endDate) query.set('end_date', endDate);

    // Gateway provides helper POST /attendance/summary which is robust against browser body stripping on GET,
    // or standard GET with query params
    try {
      const res = await request<ApiResponse<AttendanceSummaryData>>(
        `/attendance/summary?${query.toString()}`,
        { method: 'GET' }
      );
      if (res.data) return res.data;
      return res as unknown as AttendanceSummaryData;
    } catch {
      // Fallback to POST /attendance/summary if GET fails
      const postRes = await request<ApiResponse<AttendanceSummaryData>>(
        '/attendance/summary',
        {
          method: 'POST',
          body: JSON.stringify({
            employee_id: employeeId,
            ...(startDate ? { start_date: startDate } : {}),
            ...(endDate ? { end_date: endDate } : {}),
          }),
        }
      );
      if (postRes.data) return postRes.data;
      return postRes as unknown as AttendanceSummaryData;
    }
  },
};
