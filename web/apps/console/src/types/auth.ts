import type { User } from "./index";

export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
  expires_at: number;
}

export interface LoginResponse {
  user: User;
  refresh_token: string;
  expires_at: number;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
