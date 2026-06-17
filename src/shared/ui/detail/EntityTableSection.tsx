/**
 * @packageDocumentation
 *
 * Shared table section for entity detail pages, including loading, empty, and pagination states.
 */
import type { ReactNode } from 'react';
import { EmptyState, LoadingState } from '@/shared/feedback';
import { cn } from '@/shared/lib/cn';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Pagination } from '@/shared/ui/pagination';

/**
 * Column definition used by the generic entity table section.
 */
export interface EntityTableColumn<T> {
  /** Stable key used for React rendering and column identity. */
  key: string;
  /** Header content shown for the column. */
  header: ReactNode;
  /** Optional className applied to body cells in the column. */
  cellClassName?: string;
  /** Optional className applied to the header cell. */
  headClassName?: string;
  /** Renderer used to produce the cell content for each row. */
  render: (row: T, index: number) => ReactNode;
}

/**
 * Props accepted by the generic entity table section.
 */
interface EntityTableSectionProps<T> {
  /** Row data rendered in the table body. */
  rows: T[];
  /** Column definitions that describe the table layout. */
  columns: EntityTableColumn<T>[];
  /** Callback used to derive a stable React key for each row. */
  getRowKey: (row: T, index: number) => string;
  /** Indicates whether the section is currently loading data. */
  loading: boolean;
  /** Optional title shown when the row set is empty. */
  emptyTitle?: ReactNode;
  /** Optional message shown when the row set is empty. */
  emptyMessage?: ReactNode;
  /** Optional row click handler used to make rows interactive. */
  onRowClick?: (row: T) => void;
  /** Optional pagination state and change callback for the table footer. */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  /** Optional className merged into the outer section wrapper. */
  className?: string;
  /** Optional className forwarded to the shared table primitive. */
  tableClassName?: string;
}

/**
 * Renders a detail-page table with built-in loading, empty, and pagination handling.
 *
 * @param props Row data, column definitions, and optional interaction handlers.
 * @returns A feedback state or the rendered entity table section.
 */
export function EntityTableSection<T>({
  rows,
  columns,
  getRowKey,
  loading,
  emptyTitle,
  emptyMessage,
  onRowClick,
  pagination,
  className,
  tableClassName,
}: EntityTableSectionProps<T>) {
  if (loading) {
    return (
      <LoadingState
        title="Loading table"
        message="Please wait while the associated records are loaded."
        className={className}
      />
    );
  }

  if (!rows.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} className={className} />;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="overflow-hidden rounded-2xl shadow-none">
        <CardContent className="px-0 pb-0 pt-0">
          <Table className={tableClassName}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.headClassName}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={getRowKey(row, index)}
                  className={cn(onRowClick ? 'cursor-pointer focus-within:bg-blue-50 hover:bg-blue-50' : undefined)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.cellClassName}>
                      {column.render(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {pagination && pagination.totalPages > 1 ? (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      ) : null}
    </div>
  );
}
