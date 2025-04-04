
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = (userData: { email: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthenticated={handleLogin} />
      )}
    </div>
  );
};

export default Index;
