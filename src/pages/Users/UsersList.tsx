import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { RequireRole } from "@/components/auth/RequireRole";
import { useMemo, useState } from "react";
import { Role } from "@/lib/auth";

type UserRow = { id: string; name: string; email: string; role: Role };

const mockUsers: UserRow[] = [
  { id: "u-1", name: "Alice", email: "alice@example.com", role: "TenantAdmin" },
  { id: "u-2", name: "Bob", email: "bob@example.com", role: "Accountant" },
  { id: "u-3", name: "Carol", email: "carol@example.com", role: "Viewer" },
];

export default function UsersList() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>(mockUsers);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }, [q, rows]);

  const updateRole = (id: string, role: Role) => {
    // TODO: apiFetch(`/users/${id}/role`, { method: 'PUT', body: { role } })
    setRows((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    {
      field: "role",
      headerName: "Role",
      width: 180,
      renderCell: (p) => (
        <Select size="small" value={p.row.role} onChange={(e) => updateRole(p.row.id, e.target.value as Role)} fullWidth>
          <MenuItem value="TenantAdmin">TenantAdmin</MenuItem>
          <MenuItem value="Accountant">Accountant</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
        </Select>
      ),
    },
  ];
  return (
    <RequireRole role={["TenantAdmin", "Accountant"]}>
      <AppLayout
        title="Users & Roles"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Users" }]}
      >
        <PageSection title="Users" actions={<TextField size="small" label="Search users" value={q} onChange={(e) => setQ(e.target.value)} sx={{ width: 280 }} />}>
            <AppDataGrid futuristic={false} rows={filtered} columns={columns} getRowId={(r) => r.id} />
        </PageSection>
      </AppLayout>
    </RequireRole>
  );
}

