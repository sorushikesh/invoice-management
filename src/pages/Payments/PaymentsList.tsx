import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import StatusLegend from "@/components/StatusLegend";
import ActionButton from "@/components/ActionButton";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import { actionsColumn } from "@/components/datagrid/Actions";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";
import StatusBadge from "@/components/StatusBadge";
import { getPayments } from "@/services/data";

export default function PaymentsList() {
  const navigate = useNavigate();
  const rows = getPayments();

  return (
    <AppLayout
      title="Payments"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Payments" }]}
      actions={<ActionButton to="/payments/new">Record Payment</ActionButton>}
    >

      <PageSection title="Payments & Receipts">
          <StatusLegend className="mb-2" statuses={[
            { label: "Completed", kind: "payment" },
            { label: "Pending", kind: "payment" },
            { label: "Failed", kind: "payment" },
          ]} />
          <AppDataGrid futuristic={false}
            storageKey="grid:payments"
            rows={rows}
            columns={[
              { field: "id", headerName: "Payment ID", width: 140 },
              { field: "invoiceNumber", headerName: "Invoice", width: 140 },
              { field: "date", headerName: "Date", width: 120 },
              { field: "method", headerName: "Method", width: 140 },
              { field: "status", headerName: "Status", width: 140, renderCell: (p) => <StatusBadge status={String(p.value)} kind="payment" /> },
              { field: "amount", headerName: "Amount", width: 140, valueFormatter: ({ value }) => formatCurrency(value as number), align: "right", headerAlign: "right" },
              actionsColumn({ onView: (row) => navigate(`/payments/${row.id}`) }),
            ] as GridColDef[]}
            getRowId={(r) => r.id}
          />
      </PageSection>
    </AppLayout>
  );
}



