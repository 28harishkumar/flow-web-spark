import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import { initMarketingClient } from "@/lib/tracking";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const authService = new AuthService();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const storedUser = localStorage.getItem("user");

    if (userToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        initTracking(parsedUser.id, {
          email: parsedUser.email,
          first_name: parsedUser.first_name,
          last_name: parsedUser.last_name,
        });
      } catch (error) {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const initTracking = async (
    userId?: string,
    attributes?: Record<string, string | number | boolean>
  ) => {
    if (userId) {
      await initMarketingClient(userId, attributes);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      const response = await authService.login(username, password);

      localStorage.setItem("user_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setCurrentUser(response.user);

      initTracking(response.user.id, {
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
      });

      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });

      // navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");

    setCurrentUser(null);

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    // navigate("/");
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);

      await authService.forgotPassword(email);

      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast({
        title: "Request failed",
        description: "There was a problem sending the reset email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);

      await authService.resetPassword(token, password);

      toast({
        title: "Password reset",
        description: "Your password has been reset successfully",
      });

      // navigate("/dashboard");
    } catch (error) {
      console.error("Reset password failed:", error);
      toast({
        title: "Reset failed",
        description: "There was a problem resetting your password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);

      const user = await authService.updateProfile(data);

      localStorage.setItem("user", JSON.stringify(user));

      setCurrentUser(user);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      // navigate("/dashboard");
    } catch (error) {
      console.error("Update profile failed:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setLoading(true);

      await authService.changePassword(currentPassword, newPassword);

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      });
    } catch (error) {
      console.error("Change password failed:", error);
      toast({
        title: "Update failed",
        description: "There was a problem changing your password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
