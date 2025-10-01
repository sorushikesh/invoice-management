import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown, Columns3, Filter, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type GridColDef = {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: { value: any; row: any; field: string }) => React.ReactNode;
  valueGetter?: (params: { row: any }) => any;
  hide?: boolean;
};

export type AppDataGridProps = {
  rows: any[];
  columns: GridColDef[];
  getRowId?: (row: any) => any;
  onRowClick?: (id: any, row: any) => void;
  pageSize?: number;
  storageKey?: string;
  emptyMessage?: string;
  checkboxSelection?: boolean;
  selectionModel?: any[];
  onSelectionModelChange?: (model: any[]) => void;
  futuristic?: boolean;
};

export default function AppDataGrid({
  rows,
  columns,
  getRowId = (row) => row.id,
  onRowClick,
  pageSize = 10,
  storageKey,
  emptyMessage = "No data to display",
  checkboxSelection = false,
  selectionModel = [],
  onSelectionModelChange,
  futuristic = true,
}: AppDataGridProps) {
  const [page, setPage] = React.useState(() => {
    if (!storageKey) return 0;
    try {
      const raw = localStorage.getItem(`${storageKey}:pagination`);
      return raw ? JSON.parse(raw).page : 0;
    } catch {
      return 0;
    }
  });

  const [rowsPerPage, setRowsPerPage] = React.useState(() => {
    if (!storageKey) return pageSize;
    try {
      const raw = localStorage.getItem(`${storageKey}:pagination`);
      return raw ? JSON.parse(raw).pageSize : pageSize;
    } catch {
      return pageSize;
    }
  });

  const [sortField, setSortField] = React.useState<string | null>(() => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(`${storageKey}:sort`);
      const parsed = raw ? JSON.parse(raw) : [];
      return parsed[0]?.field || null;
    } catch {
      return null;
    }
  });

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(() => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(`${storageKey}:sort`);
      const parsed = raw ? JSON.parse(raw) : [];
      return parsed[0]?.sort || null;
    } catch {
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    if (!storageKey) return {};
    try {
      const raw = localStorage.getItem(`${storageKey}:columns`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(`${storageKey}:pagination`, JSON.stringify({ page, pageSize: rowsPerPage }));
  }, [page, rowsPerPage, storageKey]);

  React.useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(`${storageKey}:sort`, JSON.stringify(sortField ? [{ field: sortField, sort: sortDirection }] : []));
  }, [sortField, sortDirection, storageKey]);

  React.useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(`${storageKey}:columns`, JSON.stringify(columnVisibility));
  }, [columnVisibility, storageKey]);

  const visibleColumns = columns.filter((col) => columnVisibility[col.field] !== false && !col.hide);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0);
  };

  const filteredRows = React.useMemo(() => {
    let result = [...rows];
    
    if (searchQuery) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = col.valueGetter ? col.valueGetter({ row }) : row[col.field];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const col = columns.find((c) => c.field === sortField);
        const aVal = col?.valueGetter ? col.valueGetter({ row: a }) : a[sortField];
        const bVal = col?.valueGetter ? col.valueGetter({ row: b }) : b[sortField];
        
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === "asc" ? compare : -compare;
      });
    }

    return result;
  }, [rows, columns, searchQuery, sortField, sortDirection]);

  const paginatedRows = filteredRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const isAllSelected = paginatedRows.length > 0 && paginatedRows.every((row) => selectionModel?.includes(getRowId(row)));
  const isSomeSelected = paginatedRows.some((row) => selectionModel?.includes(getRowId(row))) && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionModelChange?.(selectionModel?.filter((id) => !paginatedRows.map(getRowId).includes(id)) || []);
    } else {
      const newSelection = [...(selectionModel || [])];
      paginatedRows.forEach((row) => {
        const id = getRowId(row);
        if (!newSelection.includes(id)) newSelection.push(id);
      });
      onSelectionModelChange?.(newSelection);
    }
  };

  const handleSelectRow = (rowId: any) => {
    const newSelection = selectionModel?.includes(rowId)
      ? selectionModel.filter((id) => id !== rowId)
      : [...(selectionModel || []), rowId];
    onSelectionModelChange?.(newSelection);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSortField(null);
    setSortDirection(null);
    setPage(0);
  };

  const cardClass = futuristic
    ? "rounded-xl border border-border/50 bg-card/65 backdrop-blur-xl shadow-lg"
    : "rounded-lg border bg-card";

  return (
    <div className={cn("w-full space-y-4", cardClass, "p-6")}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.field}
                  checked={columnVisibility[col.field] !== false && !col.hide}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, [col.field]: checked }))
                  }
                >
                  {col.headerName}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-table-header">
            <TableRow>
              {checkboxSelection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={isSomeSelected ? "opacity-50" : ""}
                  />
                </TableHead>
              )}
              {visibleColumns.map((col) => (
                <TableHead key={col.field} style={{ width: col.width }} className="font-semibold uppercase text-xs">
                  {col.sortable !== false ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(col.field)}
                    >
                      {col.headerName}
                      {sortField === col.field ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                      )}
                    </Button>
                  ) : (
                    col.headerName
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + (checkboxSelection ? 1 : 0)} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <p>{filteredRows.length === 0 && searchQuery ? "No results match the filters" : emptyMessage}</p>
                    {filteredRows.length === 0 && searchQuery && (
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, idx) => {
                const rowId = getRowId(row);
                const isSelected = selectionModel?.includes(rowId);
                return (
                  <TableRow
                    key={rowId}
                    onClick={() => onRowClick?.(rowId, row)}
                    className={cn(
                      "cursor-pointer hover:bg-table-hover",
                      idx % 2 === 0 && "bg-muted/20",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    {checkboxSelection && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(rowId)}
                          aria-label="Select row"
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((col) => {
                      const value = col.valueGetter ? col.valueGetter({ row }) : row[col.field];
                      return (
                        <TableCell key={col.field}>
                          {col.renderCell ? col.renderCell({ value, row, field: col.field }) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(0); }}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-4">
            {filteredRows.length === 0 ? "0" : page * rowsPerPage + 1}–
            {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setPage(0)} disabled={page === 0}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">
            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
