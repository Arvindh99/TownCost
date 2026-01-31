import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from './ExpenseForm';
import { CATEGORY_CONFIG, Expense } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Receipt, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrencyFromLocation } from '@/hooks/useCurrency';

export function ExpenseList() {
  const { authUser, userData } = useAuth(); // ✅ inside component
  const locationId = userData?.location_id ?? null;

  const {
    symbol,
    code,
    isLoading: currencyLoading,
  } = useCurrencyFromLocation(locationId); // ✅ inside component

  const { expenses, isLoading, deleteExpense } = useExpenses();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteExpense.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || currencyLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">
              No expenses yet
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Start tracking your spending by adding your first expense
            </p>
          </div>
          <ExpenseForm />
        </CardContent>
      </Card>
    );
  }

  // Group expenses by month
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const monthKey = format(parseISO(expense.expense_date), 'MMMM yyyy');
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
        <div key={month} className="space-y-3">
          <h3 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {month}
          </h3>
          <div className="space-y-2">
            {monthExpenses.map((expense, index) => {
              const config = CATEGORY_CONFIG[expense.category];
              return (
                <Card
                  key={expense.id}
                  className="group hover:shadow-card transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {config.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            parseISO(expense.expense_date),
                            'MMM d, yyyy'
                          )}
                          {expense.notes && ` • ${expense.notes}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {symbol}
                          {expense.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExpenseForm
                          expense={expense}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Expense
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this expense?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(expense.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === expense.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Delete'
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
