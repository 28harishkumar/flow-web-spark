import { User } from "@/types/user";
import { ApiService } from "./api";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthError {
  status: number;
  message: string;
  data: unknown;
}

export class AuthService extends ApiService {
  async login(username: string, password: string): Promise<AuthResponse> {
    if (this.mockEnabled) {
      // Simulate successful login
      return {
        token: "mock-token",
        user: {
          id: "1",
          username,
          first_name: "John",
          last_name: "Doe",
        },
      };
    }

    try {
      const response = await this.request<AuthResponse>(
        "POST",
        "/client/login/",
        {
          username,
          password,
        }
      );

      // Store token in localStorage
      localStorage.setItem("user_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      throw this.handleAuthError(error as Error);
    }
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    if (this.mockEnabled) {
      // Simulate successful registration
      return {
        token: "mock-token",
        user: {
          id: "1",
          username,
          first_name: "John",
          last_name: "Doe",
        },
      };
    }

    try {
      const response = await this.request<AuthResponse>(
        "POST",
        "/auth/register/",
        {
          username,
          password,
        }
      );

      // Store token in localStorage
      localStorage.setItem("user_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      throw this.handleAuthError(error as Error);
    }
  }

  async logout(): Promise<void> {
    await this.request<void>("POST", "/client/logout/");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
  }

  getCurrentUser(): { id: number; email: string; external_id: string } | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("user_token");
  }

  forgotPassword(email: string): Promise<void> {
    return this.request<void>("POST", "/auth/forgot-password/", { email });
  }

  resetPassword(token: string, password: string): Promise<void> {
    return this.request<void>("POST", "/auth/reset-password/", {
      token,
      password,
    });
  }

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.request<void>("POST", "/auth/change-password/", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await this.request<{ user: User }>(
      "POST",
      "/auth/update-profile/",
      profileData
    );

    return response.user;
  }

  protected handleAuthError(error: Error): AuthError {
    if (error instanceof Error) {
      return {
        status: 500,
        message: error.message,
        data: null,
      };
    }
    return {
      status: 500,
      message: "An unknown error occurred",
      data: null,
    };
  }
}
