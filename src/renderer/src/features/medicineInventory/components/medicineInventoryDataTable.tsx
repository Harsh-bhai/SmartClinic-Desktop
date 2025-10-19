import { useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
  TrashIcon,
  ListFilterIcon,
  CircleXIcon,
  Columns3Icon,
  CopyIcon,
  PencilIcon,
  PlusCircleIcon,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Medicine } from "@renderer/features/medicineInventory/medicineInventoryApi";
import { AppDispatch } from "@renderer/app/store";
import {
  deleteAllMedicines,
  deleteMedicine,
  deleteMedicineByBulk,
  setSelectedMedicine,
} from "@renderer/features/medicineInventory/medicineInventorySlice";
import { useDispatch } from "react-redux";
import AddMedicineDialog from "../components/AddMedicineDialog";
import EditMedicineDialog from "./EditMedicineDialog";
import { useAppDispatch, useAppSelector } from "@renderer/app/hooks";
import ConfirmDialog from "@renderer/components/ConfirmDialog";

type Item = Medicine;

// Search filter (name + manufacturer)
const multiColumnFilterFn: FilterFn<Item> = (row, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.manufacturer} ${row.original.type} ${row.original.relatedDisease}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export default function DataTable({ medicines }: { medicines: Medicine[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const selectedMedicine = useAppSelector(
    (state) => state.medicineInventory.selectedMedicine,
  );
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  const columns: ColumnDef<Item>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Expected Dose",
      accessorKey: "expectedDose",
    },
    {
      header: "Manufacturer",
      accessorKey: "manufacturer",
    },
    {
      header: "Related Disease",
      accessorKey: "relatedDisease",
    },
    {
      header: "Notes",
      accessorKey: "notes",
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <RowActions
          row={row}
          onEdit={(medicine: Medicine) => {
            setSelectedMedicine(medicine);
            setOpenEdit(true);
          }}
        />
      ),
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: medicines,
    columns: [
      ...columns.map((col) =>
        col.id === "actions"
          ? {
              ...col,
              cell: ({ row }) => (
                <RowActions
                  row={row}
                  onEdit={(medicine: Medicine) => {
                    dispatch(setSelectedMedicine(medicine));
                    setOpenEdit(true);
                  }}
                />
              ),
            }
          : col,
      ),
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, pagination, columnFilters, columnVisibility },
  });

  return (
    <div className="space-y-4">
      <AddMedicineDialog open={open} setOpen={setOpen} />
      {selectedMedicine && (
        <EditMedicineDialog
          open={openEdit}
          setOpen={setOpenEdit}
          medicine={selectedMedicine}
        />
      )}
      {/* 🔍 Search */}
      <div className="flex justify-between items-center gap-3">
        <div className="relative">
          <Input
            ref={inputRef}
            className={cn(
              "peer min-w-lg ps-9",
              Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
            )}
            value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            placeholder="Search by Name/ Manufacturer/ Type/ Disease..."
          />
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80">
            <ListFilterIcon size={16} />
          </div>
          {Boolean(table.getColumn("name")?.getFilterValue()) && (
            <button
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground/80 hover:text-foreground"
              onClick={() => {
                table.getColumn("name")?.setFilterValue("");
                inputRef.current?.focus();
              }}
            >
              <CircleXIcon size={16} />
            </button>
          )}
        </div>

        <div className="flex justify-center items-center gap-4">
          {/* 👁 Toggle columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon className="me-2 opacity-60" size={16} />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 🗑️ Show bulk delete if any selected */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                const ids = table
                  .getSelectedRowModel()
                  .rows.map((r) => r.original.id!);

                <ConfirmDialog
                  trigger={
                    <Button
                      variant="destructive"
                      // disabled={!ids.length}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Selected
                    </Button>
                  }
                  title={`Delete ${ids.length} selected medicine${ids.length > 1 ? "s" : ""}?`}
                  description="This action cannot be undone. All selected medicines will be permanently deleted."
                  confirmLabel="Yes, Delete"
                  destructive
                  onConfirm={() => {
                    // dispatch(deleteMedicineByBulk(ids));
                    // table.toggleAllRowsSelected(false);
                    console.log("ajsflaksdj");
                    
                  }}
                />;
              }}
              className="flex items-center gap-2"
            >
              <TrashIcon size={16} />
              Delete Selected
            </Button>
          )}

          {/* ➕ Add new medicine */}
          <Button onClick={() => setOpen(true)}>
            <PlusCircleIcon size={16} /> Add Medicine
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm("Are you sure you want to delete all medicines?")) {
                dispatch(deleteAllMedicines());
              }
            }}
          >
            <TrashIcon size={16} /> Delete All
          </Button>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="border rounded-md overflow-hidden text-left">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex h-full cursor-pointer items-center justify-between gap-2 select-none">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: <ChevronUpIcon size={14} />,
                        desc: <ChevronDownIcon size={14} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  No medicines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ⏩ Pagination */}
      <div className="flex justify-between items-center">
        {/* Left: Rows per page selector */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm bg-background"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/* Middle: Showing range info */}
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-medium">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getRowCount(),
            )}
          </span>{" "}
          of <span className="text-foreground">{table.getRowCount()}</span>
        </div>

        {/* Right: Navigation buttons */}
        {/* <Pagination> */}
        <PaginationContent className="flex items-center space-x-1">
          <PaginationItem>
            <Button
              size="icon"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon size={16} />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              size="icon"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon size={16} />
            </Button>
          </PaginationItem>
        </PaginationContent>
        {/* </Pagination> */}
      </div>
    </div>
  );
}

function RowActions({
  row,
  onEdit,
}: {
  row: any;
  onEdit: (medicine: Medicine) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const medicine = row.original;

  const handleDelete = () => {
    if (confirm(`Delete medicine "${medicine.name}"?`)) {
      dispatch(deleteMedicine(medicine.id));
    }
  };

  const handleDuplicate = () => {
    alert(`Duplicate medicine: ${medicine.name}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(medicine)}>
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <CopyIcon className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-700"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
