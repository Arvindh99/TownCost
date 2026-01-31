import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/hooks/useExpenses';
import { useCurrencyFromLocation } from '@/hooks/useCurrency';
import { useLocationById } from '@/hooks/useLocations';
import { Layout } from '@/components/layout/Layout';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { MonthlyTrend } from '@/components/dashboard/MonthlyTrend';
import { InsightCard, InsightType } from '@/components/dashboard/InsightCard';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { CATEGORIES, CATEGORY_CONFIG, ExpenseCategory } from '@/types/database';
import { format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { TrendingUp, Calendar, Receipt, Loader2, Coins } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { formatAmount } from '@/lib/currencies';

export default function Dashboard() {
  const { authUser, userData, loading: authLoading } = useAuth();
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { data: location } = useLocationById(userData?.location_id);
  const { symbol, code } = useCurrencyFromLocation(userData?.location_id);

  const formatCurrency = (amount: number) => {
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const currentMonthExpenses = expenses.filter(
      (e) => parseISO(e.expense_date) >= currentMonthStart
    );
    const lastMonthExpenses = expenses.filter(
      (e) =>
        parseISO(e.expense_date) >= lastMonthStart &&
        parseISO(e.expense_date) < currentMonthStart
    );

    const currentTotal = currentMonthExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    const lastTotal = lastMonthExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    const monthChange =
      lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

    const categoryTotals = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = currentMonthExpenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const monthlyTrend = Array.from({ length: 6 }).map((_, i) => {
      const monthStart = startOfMonth(subMonths(now, 5 - i));
      const monthEnd = startOfMonth(subMonths(now, 4 - i));
      const monthExpenses = expenses.filter(
        (e) =>
          parseISO(e.expense_date) >= monthStart &&
          parseISO(e.expense_date) < monthEnd
      );
      return {
        month: format(monthStart, 'MMM'),
        amount: monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
      };
    });

    const insights: Array<{
      message: string;
      type: InsightType;
      detail?: string;
    }> = [];
    if (lastTotal > 0) {
      if (monthChange > 10)
        insights.push({
          message: `Your spending increased ${monthChange.toFixed(
            0
          )}% compared to last month`,
          type: 'negative',
          detail: 'Consider reviewing your expenses for potential savings',
        });
      else if (monthChange < -10)
        insights.push({
          message: `Great job! Your spending decreased ${Math.abs(
            monthChange
          ).toFixed(0)}% compared to last month`,
          type: 'positive',
        });
    }

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0];
    if (topCategory && topCategory[1] > 0) {
      const [cat, amount] = topCategory;
      const percentage = (amount / currentTotal) * 100;
      if (percentage > 40)
        insights.push({
          message: `${
            CATEGORY_CONFIG[cat as ExpenseCategory].label
          } accounts for ${percentage.toFixed(0)}% of your spending`,
          type: 'neutral',
          detail: 'This is your highest expense category this month',
        });
    }

    return {
      currentTotal,
      lastTotal,
      monthChange,
      categoryTotals,
      monthlyTrend,
      transactionCount: currentMonthExpenses.length,
      insights,
    };
  }, [expenses]);

  if (authLoading) {
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
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), 'MMMM yyyy')} overview
            </p>
          </div>
          <ExpenseForm />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Monthly Total',
              value: formatCurrency(stats.currentTotal),
              trend:
                stats.lastTotal > 0
                  ? { value: stats.monthChange, label: 'vs last month' }
                  : undefined,
              icon: <Coins className="h-5 w-5 text-primary" />,
            },
            {
              title: 'Last Month',
              value: formatCurrency(stats.lastTotal),
              subtitle: 'Previous period',
              icon: <Calendar className="h-5 w-5 text-primary" />,
            },
            {
              title: 'Transactions',
              value: stats.transactionCount.toString(),
              subtitle: 'This month',
              icon: <Receipt className="h-5 w-5 text-primary" />,
            },
            {
              title: 'Avg per Transaction',
              value:
                stats.transactionCount > 0
                  ? formatCurrency(stats.currentTotal / stats.transactionCount)
                  : formatCurrency(0),
              subtitle: 'This month',
              icon: <TrendingUp className="h-5 w-5 text-primary" />,
            },
          ].map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>

        {/* Insights */}
        {stats.insights.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.insights.map((insight, idx) => (
              <InsightCard key={idx} {...insight} />
            ))}
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyTrend data={stats.monthlyTrend} currencyCode={code} />
          <CategoryBreakdown
            data={stats.categoryTotals}
            total={stats.currentTotal}
            currencyCode={code}
          />
        </div>
      </div>
    </Layout>
  );
}
