import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InsightType = 'positive' | 'negative' | 'neutral' | 'warning';

interface InsightCardProps {
  message: string;
  type: InsightType;
  detail?: string;
}

export function InsightCard({ message, type, detail }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <TrendingDown className="h-5 w-5" />;
      case 'negative':
        return <TrendingUp className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'positive':
        return 'bg-success/10 border-success/20 text-success';
      case 'negative':
        return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  return (
    <Card className={cn('border shadow-sm', getStyles())}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getIcon()}</div>
          <div>
            <p className="font-medium text-foreground">{message}</p>
            {detail && (
              <p className="text-sm text-muted-foreground mt-1">{detail}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
