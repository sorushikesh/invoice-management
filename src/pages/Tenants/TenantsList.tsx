import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import ActionButton from "@/components/ActionButton";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import { actionsColumn } from "@/components/datagrid/Actions";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RequireRole } from "@/components/auth/RequireRole";

type TenantRow = { id: string; name: string; currency: string; timeZone: string };

const mockTenants: TenantRow[] = [
  { id: "t-acme", name: "Acme", currency: "USD", timeZone: "America/Los_Angeles" },
  { id: "t-globex", name: "Globex", currency: "EUR", timeZone: "Europe/Berlin" },
];

export default function TenantsList() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockTenants;
    return mockTenants.filter((t) => t.name.toLowerCase().includes(s) || t.id.toLowerCase().includes(s));
  }, [q]);
  return (
    <RequireRole role="TenantAdmin">
      <AppLayout
        title="Tenants"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Tenants" }]}
        actions={<ActionButton to="/tenants/new">New Tenant</ActionButton>}
      >
        <div className="flex items-center mb-4 gap-2">
          <TextField size="small" label="Search tenants" value={q} onChange={(e) => setQ(e.target.value)} sx={{ width: 260 }} />
        </div>

        <PageSection title="All Tenants">
            <AppDataGrid futuristic={false}
              rows={rows as any[]}
              columns={[
                { field: "id", headerName: "ID", width: 160 },
                { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
                { field: "currency", headerName: "Currency", width: 120 },
                { field: "timeZone", headerName: "Time Zone", width: 200 },
                actionsColumn({ onView: (row) => navigate(`/tenants/${row.id}`) }),
              ] as GridColDef[]}
              getRowId={(r) => r.id}
              onRowClick={(id) => navigate(`/tenants/${id}`)}
            />
        </PageSection>
      </AppLayout>
    </RequireRole>
  );
}



