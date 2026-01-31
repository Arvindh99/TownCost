import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface LocationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ id: string; name: string }>;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function LocationSelect({
  value,
  onValueChange,
  disabled,
  placeholder,
  options,
  isLoading,
  emptyMessage = 'No options available',
}: LocationSelectProps) {
  if (isLoading) {
    return (
      <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || options.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={options.length === 0 ? emptyMessage : placeholder}
        />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-popover z-50">
        {options.map((option) => (
          <SelectItem key={option.id} value={option.name}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
