import * as React from "react";

export type ColumnDef = {
  field: string;
  headerName?: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  valueFormatter?: (params: { value: any; row: any }) => React.ReactNode;
  renderCell?: (params: { value: any; row: any }) => React.ReactNode;
  align?: string;
  headerAlign?: string;
};

export type DataTableProps = {
  rows: any[];
  columns: ColumnDef[];
  getRowId?: (row: any) => any;
  onRowClick?: (id: any, row: any) => void;
  pageSize?: number; // not implemented (simple table)
  autoHeight?: boolean; // not implemented (simple table)
  emptyMessage?: string;
};

export default function DataTable({ rows, columns, getRowId, onRowClick, emptyMessage = "No data" }: DataTableProps) {
  const idOf = (row: any, idx: number) => (getRowId ? getRowId(row) : idx);
  const headerAlignClass = (a?: string) => (a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left");
  const cellAlignClass = headerAlignClass;
  return (
    <div className="w-full overflow-x-auto glass-card rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60">
          <tr>
            {columns.map((c) => (
              <th
                key={c.field}
                className={"font-semibold px-3 py-2 tracking-wider uppercase " + headerAlignClass(c.headerAlign)}
                style={{ width: c.width, minWidth: c.minWidth }}
              >
                {c.headerName ?? c.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-muted-foreground text-center" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idOf(row, idx)}
                className="border-t hover:bg-accent/30 transition-colors"
                onClick={() => onRowClick?.(idOf(row, idx), row)}
              >
                {columns.map((c) => {
                  const value = (row as any)[c.field];
                  const display = c.renderCell
                    ? c.renderCell({ value, row })
                    : c.valueFormatter
                    ? c.valueFormatter({ value, row })
                    : (value as any);
                  return (
                    <td
                      key={c.field}
                      className={"px-3 py-2 align-middle " + cellAlignClass(c.align)}
                      style={{ width: c.width, minWidth: c.minWidth }}
                    >
                      {display as any}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
