"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  defaultMonth?: Date;
}

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
  disabledDates,
  defaultMonth,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          appearance="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            if (d) setOpen(false);
          }}
          defaultMonth={defaultMonth ?? value}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };
