import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import { actionsColumn } from "@/components/datagrid/Actions";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";
import { RequireRole } from "@/components/auth/RequireRole";

type LogRow = { id: string; ts: string; userId: string; tenantId: string; action: string; ip: string };

import { auditLogsMock } from '@/data/mocks/auditLogs';



export default function AuditLogs() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return auditLogsMock;
    return auditLogsMock.filter((r) => r.action.toLowerCase().includes(s) || r.userId.toLowerCase().includes(s));
  }, [q]);
  const columns: GridColDef[] = [
    { field: "ts", headerName: "Timestamp", flex: 1 },
    { field: "userId", headerName: "User", width: 140 },
    { field: "tenantId", headerName: "Tenant", width: 140 },
    { field: "action", headerName: "Action", flex: 1 },
    { field: "ip", headerName: "IP", width: 140 },
  ];
  return (
    <RequireRole role={["TenantAdmin"]}>
      <AppLayout
        title="Audit Logs"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Audit Logs" }]}
      >
        <PageSection title="Activity" actions={<TextField size="small" label="Filter by action or user" value={q} onChange={(e) => setQ(e.target.value)} sx={{ width: 280 }} />}>
            <AppDataGrid futuristic={false} storageKey="grid:audit-logs" rows={rows} columns={[...columns, actionsColumn({ onView: (row) => {/* noop */} })]} getRowId={(r) => r.id} />
        </PageSection>
      </AppLayout>
    </RequireRole>
  );
}

