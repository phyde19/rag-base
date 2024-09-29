"use client"

import * as React from "react"
import {
    Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
  ...[...Array(100)].map(_ => {
    return {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@yahoo.com",
      } as Payment
  })
]

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const FilterDropdown = <T extends object>({ 
    column,
    title 
}: { 
    column: Column<T, unknown>, 
    title: string
}) => {
    const [open, setOpen] = React.useState(false)
    const columnFilterValue = column.getFilterValue()
  
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{title} Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Input
              placeholder={`Filter ${title.toLowerCase()}...`}
              value={(columnFilterValue ?? "") as string}
              onChange={(event) =>
                column.setFilterValue(event.target.value)
              }
              onKeyDown={e => {
                if (e.key === 'Enter') {
                    setOpen(false)
                }
              }}
              className="max-w-sm"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}

export type ColumnSchemaEntry = {
    accessorKey: string;
    header: string;
    allowSorting: boolean;
    valueModifier?: (value: any) => string;
    align?: 'left' | 'right';
}

export type ColumnSchema = ColumnSchemaEntry[]

const columnSchema: ColumnSchema = [
    {
        accessorKey: 'status',
        header: 'Status',
        allowSorting: false,
    },
    {
        accessorKey: 'email',
        header: 'File Name',
        allowSorting: true,
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        allowSorting: true,
        valueModifier: (value: number) => {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(value);
        },
        align: 'left'
    },
]

const getColumnDefFromSchema = <T extends object>(columnSchema: ColumnSchema): ColumnDef<T>[] => {
    const baseColumns: ColumnDef<T>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];

    const schemaColumns: ColumnDef<T>[] = columnSchema.map((schema): ColumnDef<T> => ({
        accessorKey: schema.accessorKey,
        header: ({ column }) => (
            <div className={cn(
                'flex items-center',
                schema.align == 'right' ? 'justify-end' : 'justify-start'
            )}>
                {schema.allowSorting ? (
                    <Button
                        variant="ghost"
                        className="pl-0"
                        onClick={() => {
                            const isSorted = column.getIsSorted();
                            if (isSorted === "asc") {
                                column.toggleSorting(true); // Switch to descending
                            } else if (isSorted === "desc") {
                                column.clearSorting(); // Clear sorting (unsorted)
                            } else {
                                column.toggleSorting(); // Switch to ascending
                            }
                        }}
                    >
                        {schema.header}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <span>{schema.header}</span>
                )}
                <FilterDropdown column={column} title={schema.header} />
            </div>
        ),
        cell: ({ row }) => {
            const value = row.getValue(schema.accessorKey);
            const displayValue = schema.valueModifier ? schema.valueModifier(value) : String(value);
            return <div className={cn(schema.align === 'right' ? 'text-right' : 'text-left')}>{displayValue}</div>;
        },
    }));

    const actionsColumn: ColumnDef<T> = {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText((item as any).id)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText((item as any).id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };

    return [...baseColumns, ...schemaColumns, actionsColumn];
};

export function PaymentsTable() {
    const [rowSelection, setRowSelection] = React.useState({})
    return (
        <DataTable 
            data={data} 
            columnSchema={columnSchema} 
            searchColumn="email" 
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
        />
    )
}

type DataTableProps<TData> = {
    data: TData[];
    columnSchema: ColumnSchema;
    searchColumn?: string;
    rowSelection: Record<number, boolean>;
    setRowSelection: (selection: object) => void;
}

export function DataTable<TData extends object>({
    data, 
    columnSchema, 
    searchColumn,
    rowSelection,
    setRowSelection
}: DataTableProps<TData>
) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const columns = React.useMemo<ColumnDef<TData>[]>(
    () => getColumnDefFromSchema<TData>(columnSchema),
    [columnSchema]
  );

  const searchColumnHeader = React.useMemo(() => {
    const column = columnSchema.find(col => col.accessorKey === searchColumn);
    return column?.header
  }, [columnSchema]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className="w-[980px]">
      <div className="flex items-center py-4">
        {searchColumn && (
            <Input
                placeholder={`Filter ${searchColumnHeader}...`}
                value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                }
                className="max-w-sm focus-visible:ring-0"
            />
        )}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                        column.toggleVisibility(!!value)
                    }
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
