import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useExpenses } from '@/hooks/useExpenses';
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  ExpenseCategory,
  Expense,
} from '@/types/database';
import { Loader2, Plus, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrencyFromLocation } from '@/hooks/useCurrency';

const expenseSchema = z.object({
  category: z.enum([
    'groceries',
    'rent',
    'fuel',
    'utilities',
    'transport',
    'internet_mobile',
  ]),
  amount: z.coerce
    .number()
    .positive('Amount must be positive')
    .max(999999, 'Amount too large'),
  expense_date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ExpenseForm({ expense, trigger, onSuccess }: ExpenseFormProps) {
  const { userData, profile } = useAuth();
  const locationId = userData?.location_id ?? null;
  const {
    symbol,
    code,
    isLoading: currencyLoading,
  } = useCurrencyFromLocation(locationId);

  const { addExpense, updateExpense } = useExpenses();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!expense;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: expense?.category ?? 'groceries',
      amount: expense?.amount ?? undefined,
      expense_date: expense?.expense_date ?? format(new Date(), 'yyyy-MM-dd'),
      notes: expense?.notes ?? '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          category: data.category,
          amount: data.amount,
          expense_date: data.expense_date,
          notes: data.notes,
        });
      } else {
        await addExpense.mutateAsync({
          category: data.category,
          amount: data.amount,
          expense_date: data.expense_date,
          notes: data.notes,
        });
      }
      setOpen(false);
      form.reset();
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the expense details below'
              : 'Record a new expense to track your spending'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: CATEGORY_CONFIG[cat].color,
                              }}
                            />
                            {CATEGORY_CONFIG[cat].label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount {symbol ? `(${symbol})` : ''}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {symbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="999999"
                        className={symbol ? 'pl-12' : ''}
                        placeholder="0.00"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expense_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : isEditing ? (
                  'Update Expense'
                ) : (
                  'Add Expense'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
