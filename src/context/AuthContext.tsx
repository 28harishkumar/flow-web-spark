import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types/user";
import { AuthService } from "@/services/auth";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const authService = new AuthService();

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;

  updateProfile: (data: { name?: string; username?: string }) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
