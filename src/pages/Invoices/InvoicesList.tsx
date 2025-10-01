import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import StatusLegend from "@/components/StatusLegend";
import ActionButton from "@/components/ActionButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import { actionsColumn } from "@/components/datagrid/Actions";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";
import StatusBadge from "@/components/StatusBadge";
import { getInvoices } from "@/services/data";

export default function InvoicesList() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const all = getInvoices();
  const filtered = useMemo(() => all.filter((r) => {
    const qs = q.trim().toLowerCase();
    const matchQ = !qs || r.number.toLowerCase().includes(qs) || r.customerName.toLowerCase().includes(qs);
    const matchStatus = status === "all" || r.status.toLowerCase() === status;
    return matchQ && matchStatus;
  }), [q, status]);
  const columns: GridColDef[] = [
    { field: "number", headerName: "Number", flex: 1, minWidth: 140 },
    { field: "customerName", headerName: "Client", flex: 1, minWidth: 180 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "due", headerName: "Due", width: 120 },
    { field: "amount", headerName: "Amount", width: 140, valueFormatter: ({ value }) => formatCurrency(value as number), align: "right", headerAlign: "right" },
    { field: "status", headerName: "Status", width: 120, renderCell: (p) => <StatusBadge status={String(p.value)} kind="invoice" /> },
    actionsColumn({
      onView: (row) => navigate(`/invoices/${row.number}`),
      onEdit: (row) => navigate(`/invoices/${row.number}`),
      onDelete: (row) => {
        if (confirm(`Delete invoice ${row.number}?`)) {
          // TODO: delete action
        }
      },
    }),
  ];
  return (
    <AppLayout
      title="Invoices"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Invoices" }]}
      actions={<ActionButton to="/invoices/new">Create Invoice</ActionButton>}
    >
      <div className="flex items-center gap-3 mb-4">
        <TextField size="small" label="Search number or customer" value={q} onChange={(e) => setQ(e.target.value)} sx={{ width: 300 }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={status} onChange={(e) => setStatus(String(e.target.value))}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </Select>
        </FormControl>
      </div>

      <PageSection title="Invoices">
          <StatusLegend className="mb-2" statuses={[
            { label: "Draft", kind: "invoice" },
            { label: "Sent", kind: "invoice" },
            { label: "Paid", kind: "invoice" },
            { label: "Overdue", kind: "invoice" },
          ]} />
          <AppDataGrid futuristic={false} storageKey="grid:invoices" rows={filtered} columns={columns} getRowId={(r) => r.number} onRowClick={(id) => navigate(`/invoices/${id}`)} />
      </PageSection>
    </AppLayout>
  );
}

