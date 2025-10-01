import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import StatusLegend from "@/components/StatusLegend";
import ActionButton from "@/components/ActionButton";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import { actionsColumn } from "@/components/datagrid/Actions";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";
import { toast } from "@/hooks/use-toast";

const rows = [
  { number: "EST-2001", client: "Acme Corp", date: "2025-09-15", amount: 950, status: "Sent" },
  { number: "EST-2002", client: "Globex", date: "2025-09-20", amount: 1200, status: "Accepted" },
  { number: "EST-2003", client: "Initech", date: "2025-09-26", amount: 650, status: "Draft" },
];

export default function EstimatesList() {
  const navigate = useNavigate();

  const convertToInvoice = (estNumber: string) => {
    toast({ title: "Converted", description: `${estNumber} converted to invoice draft.` });
    navigate("/invoices/new");
  };

  return (
    <AppLayout
      title="Estimates"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Estimates" }]}
      actions={<ActionButton to="/estimates/new">Create Estimate</ActionButton>}
    >

      <PageSection title="Quotes / Estimates">
          <StatusLegend className="mb-2" statuses={[
            { label: "Draft", kind: "generic" },
            { label: "Sent", kind: "generic" },
            { label: "Accepted", kind: "generic" },
          ]} />
          <AppDataGrid
            futuristic={false}
            rows={rows as any[]}
            columns={[
              { field: "number", headerName: "Number", width: 140 },
              { field: "client", headerName: "Client", flex: 1, minWidth: 180 },
              { field: "date", headerName: "Date", width: 120 },
              { field: "amount", headerName: "Amount", width: 140, valueFormatter: ({ value }) => formatCurrency(value as number), align: "right", headerAlign: "right" },
              { field: "status", headerName: "Status", width: 140 },
              actionsColumn({ onView: (row) => convertToInvoice(row.number) }),
            ] as GridColDef[]}
            getRowId={(r) => r.number}
            onRowClick={(id) => convertToInvoice(String(id))}
          />
      </PageSection>
    </AppLayout>
  );
}


