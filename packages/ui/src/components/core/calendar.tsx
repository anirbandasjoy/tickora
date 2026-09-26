"use client";

import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
  disabled?: (date: Date) => boolean;
  className?: string;
}

function Calendar({ selected, onSelect, defaultMonth, disabled, className }: CalendarProps) {
  const [month, setMonth] = React.useState(() => startOfMonth(defaultMonth ?? selected ?? new Date()));

  React.useEffect(() => {
    const base = defaultMonth ?? selected;
    if (base) setMonth(startOfMonth(base));
  }, [defaultMonth, selected]);

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  return (
    <div className={cn("p-3", className)}>
      <div className="mb-2 flex items-center justify-between">
        <Button size="icon-sm" appearance="ghost" variant="default" onClick={() => setMonth((m) => startOfMonth(addMonths(m, -1)))} aria-label="Previous month">
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-sm font-semibold">{format(month, "MMMM yyyy")}</p>
        <Button size="icon-sm" appearance="ghost" variant="default" onClick={() => setMonth((m) => startOfMonth(addMonths(m, 1)))} aria-label="Next month">
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <p key={d} className="pb-1 text-center text-[11px] font-medium text-muted-foreground">
            {d}
          </p>
        ))}
        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const outside = !isSameMonth(day, month);
          const isDisabled = disabled?.(day) ?? false;
          return (
            <Button
              key={day.toISOString()}
              size="icon-sm"
              mode="icon"
              variant={isSelected ? "primary" : "default"}
              appearance={isSelected ? "solid" : "ghost"}
              disabled={isDisabled}
              onClick={() => onSelect?.(isSelected ? undefined : day)}
              aria-label={format(day, "PPP")}
              className={cn(outside && !isSelected && "opacity-40")}
            >
              {format(day, "d")}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
