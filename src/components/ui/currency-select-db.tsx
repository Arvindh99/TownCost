import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrenciesFromDB } from '@/hooks/useLocations';
import { Loader2 } from 'lucide-react';

interface CurrencySelectDBProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function CurrencySelectDB({
  value,
  onValueChange,
  disabled,
}: CurrencySelectDBProps) {
  const { data: currencies, isLoading } = useCurrenciesFromDB();

  if (isLoading) {
    return (
      <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground text-sm">
          Loading currencies...
        </span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-popover z-50">
        {currencies?.map((currency) => (
          <SelectItem key={currency.id} value={currency.code}>
            <span className="flex items-center gap-2">
              <span className="font-medium">{currency.symbol}</span>
              <span>{currency.code}</span>
              <span className="text-muted-foreground">- {currency.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
