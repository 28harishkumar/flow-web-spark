import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "./provider/AuthProvider";
import WorkflowEditor from "./pages/WorkflowEditor";
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { currentUser, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardContent>
            <Loader2 className="animate-spin" />
          </CardContent>
        </CardHeader>
      </Card>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthPage />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/workflows/:workflowId"
              element={
                <ProtectedRoute>
                  <WorkflowEditor />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
