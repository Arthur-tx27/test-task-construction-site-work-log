'use client';

import * as React from 'react';
import { DayPicker, UI, DayFlag, SelectionState, useDayPicker } from 'react-day-picker';
import type { MonthCaptionProps } from 'react-day-picker';
import { ru } from 'date-fns/locale/ru';

import { cn } from '@/shared/lib/utils';

function CalendarMonthCaption({ calendarMonth }: MonthCaptionProps) {
  const { goToMonth, previousMonth, nextMonth, components, labels } =
    useDayPicker();

  return (
    <div className="flex h-8 items-center justify-between px-2">
      <button
        type="button"
        className={cn(
          'inline-flex size-7 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium',
          previousMonth
            ? 'cursor-pointer opacity-50 hover:opacity-100'
            : 'opacity-25',
        )}
        disabled={!previousMonth}
        aria-label={labels.labelPrevious(previousMonth)}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <components.Chevron disabled={!previousMonth} orientation="left" />
      </button>
      <span className="text-sm font-medium">
        {calendarMonth.date.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })}
      </span>
      <button
        type="button"
        className={cn(
          'inline-flex size-7 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium',
          nextMonth
            ? 'cursor-pointer opacity-50 hover:opacity-100'
            : 'opacity-25',
        )}
        disabled={!nextMonth}
        aria-label={labels.labelNext(nextMonth)}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <components.Chevron disabled={!nextMonth} orientation="right" />
      </button>
    </div>
  );
}

function Calendar({ className, classNames, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ru}
      className={cn('w-fit p-3', className)}
      components={{
        MonthCaption: CalendarMonthCaption,
      }}
      classNames={{
        [UI.Root]: 'w-fit',
        [UI.Months]: 'flex flex-col gap-2',
        [UI.Month]: 'flex flex-col gap-2',
        [UI.MonthCaption]: '',
        [UI.Nav]: 'hidden',
        [UI.Weekdays]: 'flex',
        [UI.Weekday]: 'w-8 text-xs font-normal text-muted-foreground',
        [UI.Week]: 'flex',
        [UI.Day]: 'size-8 p-0 text-sm',
        [UI.DayButton]:
          'inline-flex size-8 cursor-pointer items-center justify-center rounded-md bg-transparent p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        [SelectionState.selected]:
          'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground',
        [DayFlag.today]: 'bg-accent text-accent-foreground font-semibold',
        [DayFlag.outside]: 'text-muted-foreground opacity-50',
        [DayFlag.disabled]:
          'cursor-not-allowed text-muted-foreground opacity-50 hover:bg-transparent',
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
