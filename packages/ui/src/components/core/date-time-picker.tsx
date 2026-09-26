"use client";

import { format } from "date-fns";
import * as React from "react";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

// ---------------------------------------------------------------------------
// Shared base
// ---------------------------------------------------------------------------

interface BaseDateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  defaultMonth?: Date;
  triggerProps?: Omit<ButtonProps, "children" | "className">;
  mode: "12h" | "24h";
  /** Step between selectable hours (default: 1) */
  hourInterval?: number;
  /** Step between selectable minutes (default: 5) */
  minuteInterval?: number;
}

function BaseDateTimePicker({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  disabledDates,
  defaultMonth,
  triggerProps,
  mode,
  hourInterval = 1,
  minuteInterval = 5,
}: BaseDateTimePickerProps) {
  const is24h = mode === "24h";
  const [open, setOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    if (open) setLocalValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const totalHours = is24h ? 24 : 12;
  const startHour = is24h ? 0 : 1;
  const hours = Array.from(
    { length: Math.ceil(totalHours / hourInterval) },
    (_, i) => startHour + i * hourInterval,
  ).filter((h) => h < startHour + totalHours);

  const minutes = Array.from(
    { length: Math.ceil(60 / minuteInterval) },
    (_, i) => i * minuteInterval,
  ).filter((m) => m < 60);

  const displayFormat = is24h ? "MM/dd/yyyy HH:mm" : "MM/dd/yyyy hh:mm aa";
  const defaultPlaceholder = is24h ? "MM/DD/YYYY HH:mm" : "MM/DD/YYYY hh:mm aa";

  const isHourActive = (hour: number) =>
    !!localValue &&
    (is24h
      ? localValue.getHours() === hour
      : localValue.getHours() % 12 === hour % 12);

  /** End of the given hour on the current local date — used to check if the *entire* hour is before minDate. */
  const dateWithHour = (hour: number): Date => {
    const d = new Date(localValue ?? new Date());
    if (is24h) {
      d.setHours(hour, 59, 59, 999);
    } else {
      d.setHours((hour % 12) + (d.getHours() >= 12 ? 12 : 0), 59, 59, 999);
    }
    return d;
  };

  /** End of the given minute on the current date/hour — used to check if the specific minute slot is before minDate. */
  const dateWithMinute = (minute: number): Date => {
    const d = new Date(localValue ?? new Date());
    d.setMinutes(minute, 59, 999);
    return d;
  };

  /** End of the AM (11:59:59) or PM (23:59:59) block — used to check if the entire period is before minDate. */
  const dateWithAmPm = (ampm: string): Date => {
    const d = new Date(localValue ?? new Date());
    if (ampm === "AM") {
      d.setHours(11, 59, 59, 999);
    } else {
      d.setHours(23, 59, 59, 999);
    }
    return d;
  };

  const isHourDisabled = (hour: number): boolean =>
    !!disabledDates && disabledDates(dateWithHour(hour));

  const isMinuteDisabled = (minute: number): boolean =>
    !!disabledDates && !!localValue && disabledDates(dateWithMinute(minute));

  const isAmPmDisabled = (ampm: string): boolean =>
    !!disabledDates && !!localValue && disabledDates(dateWithAmPm(ampm));

  const isConfirmDisabled = !!(localValue && disabledDates?.(localValue));

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    if (localValue) {
      const merged = new Date(selectedDate);
      merged.setHours(localValue.getHours(), localValue.getMinutes());
      setLocalValue(merged);
    } else {
      setLocalValue(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute" | "ampm", val: string) => {
    const next = new Date(localValue ?? new Date());
    if (type === "hour") {
      if (is24h) {
        next.setHours(parseInt(val, 10));
      } else {
        const h = parseInt(val, 10) % 12;
        next.setHours(h + (next.getHours() >= 12 ? 12 : 0));
      }
    } else if (type === "minute") {
      next.setMinutes(parseInt(val, 10));
    } else if (type === "ampm") {
      const cur = next.getHours();
      if (val === "PM" && cur < 12) next.setHours(cur + 12);
      else if (val === "AM" && cur >= 12) next.setHours(cur - 12);
    }
    setLocalValue(next);
  };

  const handleConfirm = () => {
    onChange(localValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        if (v) setOpen(true);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          appearance="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
          {...triggerProps}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, displayFormat)
          ) : (
            <span>{placeholder ?? defaultPlaceholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={localValue}
            onSelect={handleDateSelect}
            defaultMonth={defaultMonth ?? localValue}
            disabled={
              disabledDates
                ? (d: Date) => {
                    const end = new Date(d);
                    end.setHours(23, 59, 59, 999);
                    return disabledDates(end);
                  }
                : undefined
            }
          />
          <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0">
            {/* Hour column */}
            <div className="flex flex-col">
              <p className="border-b px-3 py-1.5 text-center text-xs font-medium text-muted-foreground">
                Hour
              </p>
              <ScrollArea className="h-65 w-full sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {hours
                    .slice()
                    .reverse()
                    .map((hour) => {
                      const isDisabled = isHourDisabled(hour);
                      return (
                        <Button
                          key={hour}
                          size="icon-sm"
                          variant={isHourActive(hour) ? "primary" : "default"}
                          appearance={isHourActive(hour) ? "solid" : "ghost"}
                          className="aspect-square shrink-0 sm:w-full"
                          disabled={isDisabled}
                          onClick={() =>
                            handleTimeChange("hour", hour.toString())
                          }
                        >
                          {hour}
                        </Button>
                      );
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>

            {/* Minute column */}
            <div className="flex flex-col">
              <p className="border-b px-3 py-1.5 text-center text-xs font-medium text-muted-foreground">
                Min
              </p>
              <ScrollArea className="h-65 w-full sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {minutes.map((minute) => {
                    const isDisabled = isMinuteDisabled(minute);
                    return (
                      <Button
                        key={minute}
                        size="icon-sm"
                        variant={
                          localValue && localValue.getMinutes() === minute
                            ? "primary"
                            : "default"
                        }
                        appearance={
                          localValue && localValue.getMinutes() === minute
                            ? "solid"
                            : "ghost"
                        }
                        className="aspect-square shrink-0 sm:w-full"
                        disabled={isDisabled}
                        onClick={() =>
                          handleTimeChange("minute", minute.toString())
                        }
                      >
                        {minute.toString().padStart(2, "0")}
                      </Button>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>

            {/* AM/PM column — 12h only */}
            {!is24h && (
              <div className="flex flex-col">
                <p className="border-b px-3 py-1.5 text-center text-xs font-medium text-muted-foreground">
                  AM/PM
                </p>
                <div className="flex p-2 sm:flex-col">
                  {["AM", "PM"].map((ampm) => {
                    const active =
                      !!localValue &&
                      ((ampm === "AM" && localValue.getHours() < 12) ||
                        (ampm === "PM" && localValue.getHours() >= 12));
                    return (
                      <Button
                        key={ampm}
                        size="icon-sm"
                        variant={active ? "primary" : "default"}
                        appearance={active ? "solid" : "ghost"}
                        className="aspect-square shrink-0 sm:w-full"
                        disabled={isAmPmDisabled(ampm)}
                        onClick={() => handleTimeChange("ampm", ampm)}
                      >
                        {ampm}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t p-3">
          <Button size="sm" appearance="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            appearance="solid"
            variant="primary"
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// 12h public wrapper
// ---------------------------------------------------------------------------

export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  defaultMonth?: Date;
  triggerProps?: Omit<ButtonProps, "children" | "className">;
  /** Step between selectable hours (default: 1) */
  hourInterval?: number;
  /** Step between selectable minutes (default: 5) */
  minuteInterval?: number;
}

function DateTimePicker({
  value,
  onChange,
  placeholder = "MM/DD/YYYY hh:mm aa",
  className,
  disabled,
  disabledDates,
  defaultMonth,
  triggerProps,
  hourInterval,
  minuteInterval,
}: DateTimePickerProps) {
  return (
    <BaseDateTimePicker
      mode="12h"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      disabledDates={disabledDates}
      defaultMonth={defaultMonth}
      triggerProps={triggerProps}
      hourInterval={hourInterval}
      minuteInterval={minuteInterval}
    />
  );
}

DateTimePicker.displayName = "DateTimePicker";

// ---------------------------------------------------------------------------
// 24h public wrapper
// ---------------------------------------------------------------------------

export interface DateTimePicker24hProps extends DateTimePickerProps {}

function DateTimePicker24h(props: DateTimePicker24hProps) {
  return <BaseDateTimePicker mode="24h" {...props} />;
}

DateTimePicker24h.displayName = "DateTimePicker24h";

export { DateTimePicker, DateTimePicker24h };
