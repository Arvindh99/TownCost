import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Expenses() {
  const { authUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!authUser) return <Navigate to="/auth" replace />;
  if (!userData) return <ProfileSetupForm />;

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Expenses
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your expenses
            </p>
          </div>
          <ExpenseForm />
        </div>

        {/* Expense List */}
        <ExpenseList />
      </div>
    </Layout>
  );
}
