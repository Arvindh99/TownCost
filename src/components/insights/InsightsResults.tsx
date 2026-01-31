import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CategoryAverage {
  category: string;
  month: string;
  user_count: number;
  avg_amount: number | null;
}

interface CostOfLivingIndex {
  month: string;
  user_count: number;
  cost_index: number | null;
}

interface InsightsResultsProps {
  categoryAverages: CategoryAverage[];
  costOfLivingIndex: CostOfLivingIndex[];
  searchLevel: 'area' | 'city' | 'country';
  searchLocation: string;
  currencySymbol?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  rent: 'Rent',
  groceries: 'Groceries',
  utilities: 'Utilities',
  transport: 'Transport',
  fuel: 'Fuel',
  internet_mobile: 'Internet & Mobile',
  other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  rent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  groceries:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  utilities:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  fuel: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  internet_mobile:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export function InsightsResults({
  categoryAverages,
  costOfLivingIndex,
  searchLevel,
  searchLocation,
  currencySymbol,
}: InsightsResultsProps) {
  // Group category averages by month for the latest month
  const latestMonth =
    categoryAverages.length > 0
      ? categoryAverages.reduce(
          (latest, curr) =>
            new Date(curr.month) > new Date(latest) ? curr.month : latest,
          categoryAverages[0].month
        )
      : null;

  const latestCategoryData = categoryAverages.filter(
    (item) => item.month === latestMonth
  );

  const latestCOL =
    costOfLivingIndex.length > 0
      ? costOfLivingIndex.reduce(
          (latest, curr) =>
            new Date(curr.month) > new Date(latest.month) ? curr : latest,
          costOfLivingIndex[0]
        )
      : null;

  const hasData =
    latestCategoryData.some((item) => item.avg_amount !== null) ||
    (latestCOL && latestCOL.cost_index !== null);

  if (!hasData) {
    return (
      <Card className="shadow-card border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Insufficient Data
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Currently, there aren't enough users tracking expenses in{' '}
                <strong>{searchLocation}</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cost of Living Index Card */}
      {latestCOL && latestCOL.cost_index !== null && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Cost of Living Index
                </CardTitle>
                <CardDescription>
                  Weighted index for {searchLocation}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {latestCOL.user_count} users
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {currencySymbol || '₹'}
                {latestCOL.cost_index.toLocaleString()}
              </span>
              <span className="text-muted-foreground">/month (weighted)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on: Rent (35%), Groceries (30%), Transport (15%), Utilities
              (10%), Internet (10%)
            </p>
            {latestMonth && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(latestMonth), 'MMMM yyyy')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      {latestCategoryData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Category Breakdown
            </CardTitle>
            <CardDescription>
              Average monthly expenses by category in {searchLocation}
              {latestMonth &&
                ` (${format(new Date(latestMonth), 'MMMM yyyy')})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Average Amount</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestCategoryData
                  .filter((item) => item.avg_amount !== null)
                  .sort((a, b) => (b.avg_amount || 0) - (a.avg_amount || 0))
                  .map((item) => (
                    <TableRow key={item.category}>
                      <TableCell>
                        <Badge
                          className={
                            CATEGORY_COLORS[item.category] ||
                            CATEGORY_COLORS.other
                          }
                        >
                          {CATEGORY_LABELS[item.category] || item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {currencySymbol || '₹'}
                        {item.avg_amount?.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.user_count}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {latestCategoryData.every((item) => item.avg_amount === null) && (
              <p className="text-center text-muted-foreground py-4">
                Not enough data for category breakdown
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historical Trends */}
      {costOfLivingIndex.length > 1 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Historical Trends
            </CardTitle>
            <CardDescription>Cost of living index over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Index</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costOfLivingIndex
                  .filter((item) => item.cost_index !== null)
                  .sort(
                    (a, b) =>
                      new Date(b.month).getTime() - new Date(a.month).getTime()
                  )
                  .slice(0, 6)
                  .map((item) => (
                    <TableRow key={item.month}>
                      <TableCell>
                        {format(new Date(item.month), 'MMMM yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {currencySymbol || '₹'}
                        {item.cost_index?.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.user_count}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
