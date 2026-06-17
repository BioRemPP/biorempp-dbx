/**
 * @packageDocumentation
 *
 * Shared tab navigation component used by entity detail pages.
 */
import type { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/cn';

/**
 * One tab descriptor rendered by the entity tabs component.
 */
export interface EntityTabItem<T extends string = string> {
  /** Stable tab value used by the tabs primitive. */
  value: T;
  /** User-facing tab label. */
  label: string;
  /** Optional count appended to the tab label. */
  count?: number;
}

/**
 * Props accepted by the shared entity tabs component.
 */
interface EntityTabsProps<T extends string> {
  /** Active tab value. */
  value: T;
  /** Callback invoked when the active tab changes. */
  onValueChange: (value: T) => void;
  /** Tab descriptors rendered in the tab list. */
  tabs: EntityTabItem<T>[];
  /** Tab content rendered below the tab list. */
  children: ReactNode;
  /** Optional className merged into the root tabs wrapper. */
  className?: string;
  /** Optional className merged into the tabs list wrapper. */
  listClassName?: string;
  /** Optional className merged into the content wrapper. */
  contentClassName?: string;
}

/**
 * Renders a detail-page tab list with optional count badges in the trigger labels.
 *
 * @param props Active tab state, tab descriptors, content, and styling overrides.
 * @returns A tabbed detail layout container.
 */
export function EntityTabs<T extends string>({
  value,
  onValueChange,
  tabs,
  children,
  className,
  listClassName,
  contentClassName,
}: EntityTabsProps<T>) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as T)}
      className={className}
    >
      <div className="border-t border-slate-200 px-6 py-4">
        <TabsList
          className={cn(
            'h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-0 text-slate-600 shadow-none',
            listClassName
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="border border-transparent bg-transparent data-[state=active]:border-blue-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              {tab.count == null ? tab.label : `${tab.label} (${tab.count})`}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className={cn('px-6 pb-6', contentClassName)}>{children}</div>
    </Tabs>
  );
}

/**
 * Re-export of the shared tab content primitive for use with entity tabs.
 */
export const EntityTabsContent = TabsContent;
