import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Expenses from '@/pages/Expenses';
import Insights from '@/pages/Insights';
import Profile from '@/pages/Profile';
import About from '@/pages/About';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      {/* Auth page: redirect to / if user is logged in */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />

      {/* Redirect all unknown routes to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <AppRoutes />
          </TooltipProvider>

          {/* Global UI */}
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
