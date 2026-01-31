export type ExpenseCategory =
  | 'groceries'
  | 'rent'
  | 'fuel'
  | 'utilities'
  | 'transport'
  | 'internet_mobile';

export interface Location {
  id: string;
  country: string;
  state: string;
  city: string;
  currency: string;
  symbol: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  location_id: string | null;
  household_size: number | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryAverage {
  category: ExpenseCategory;
  month: string;
  user_count: number;
  avg_amount: number | null;
}

export interface CostOfLivingIndex {
  month: string;
  user_count: number;
  cost_index: number | null;
}

export const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  {
    label: string;
    icon: string;
    color: string;
    weight: number;
  }
> = {
  groceries: {
    label: 'Groceries',
    icon: 'ShoppingCart',
    color: 'hsl(142, 71%, 45%)',
    weight: 0.3,
  },
  rent: {
    label: 'Rent',
    icon: 'Home',
    color: 'hsl(262, 83%, 58%)',
    weight: 0.35,
  },
  fuel: {
    label: 'Fuel',
    icon: 'Fuel',
    color: 'hsl(25, 95%, 53%)',
    weight: 0.075,
  },
  utilities: {
    label: 'Utilities',
    icon: 'Zap',
    color: 'hsl(45, 93%, 47%)',
    weight: 0.1,
  },
  transport: {
    label: 'Transport',
    icon: 'Car',
    color: 'hsl(199, 89%, 48%)',
    weight: 0.075,
  },
  internet_mobile: {
    label: 'Internet/Mobile',
    icon: 'Wifi',
    color: 'hsl(330, 81%, 60%)',
    weight: 0.1,
  },
};

export const CATEGORIES: ExpenseCategory[] = [
  'groceries',
  'rent',
  'fuel',
  'utilities',
  'transport',
  'internet_mobile',
];
