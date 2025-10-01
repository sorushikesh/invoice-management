import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getStoreCustomers, updateStoreCustomer, StoreCustomer, CustomerCategory, CustomerStatus } from "@/services/data";

const statusFilters: Array<{ label: string; value: CustomerStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const typeFilters: Array<{ label: string; value: CustomerCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Individual", value: "Individual" },
  { label: "Business", value: "Business" },
];

type Row = {
  id: string;
  name: string;
  type: CustomerCategory;
  email: string;
  phone?: string;
  status: CustomerStatus;
  loyaltyPoints: number;
};

function mapRows(customers: StoreCustomer[]): Row[] {
  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    type: customer.type,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    loyaltyPoints: customer.loyaltyPoints,
  }));
}

export default function CustomersList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [type, setType] = useState<CustomerCategory | "all">("all");
  const [selection, setSelection] = useState<string[]>([]);
  const [version, setVersion] = useState(0);

  const customers = useMemo(() => getStoreCustomers(), [version]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesStatus = status === "all" || customer.status === status;
      const matchesType = type === "all" || customer.type === type;
      const matchesSearch = term.length === 0
        || customer.name.toLowerCase().includes(term)
        || customer.email.toLowerCase().includes(term)
        || (customer.phone || "").toLowerCase().includes(term);
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [customers, status, type, search]);

  const rows = useMemo(() => mapRows(filtered), [filtered]);

  const toggleStatus = (id: string, next: CustomerStatus) => {
    updateStoreCustomer(id, { status: next });
    toast({ title: `Customer ${next === "Active" ? "activated" : "deactivated"}` });
    setVersion((v) => v + 1);
  };

  const bulkStatus = (next: CustomerStatus) => {
    if (selection.length === 0) {
      toast({ title: "Select customers first", variant: "destructive" });
      return;
    }
    selection.forEach((id) => updateStoreCustomer(id, { status: next }));
    toast({ title: `Customers ${next === "Active" ? "activated" : "deactivated"}` });
    setSelection([]);
    setVersion((v) => v + 1);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Customer Name", flex: 1.3 },
    { field: "type", headerName: "Customer Type", width: 160 },
    { field: "email", headerName: "Email", flex: 1.2 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => <StatusBadge status={String(value)} kind="generic" />,
    },
    {
      field: "loyaltyPoints",
      headerName: "Loyalty Points",
      width: 140,
      renderCell: ({ value }) => <span className="tabular-nums font-medium">{value as number}</span>,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/customers/${row.id}`); }}>View</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/customers/${row.id}/edit`); }}>Edit</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(row.id, row.status === "Active" ? "Inactive" : "Active");
            }}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Customers"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Customers" }]}
      actions={<Button onClick={() => navigate("/customers/new")}>+ Add Customer</Button>}
    >
      <div className="grid gap-4 mb-6">
        <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone"
              className="w-64"
            />
            <Select value={status} onValueChange={(value) => setStatus(value as CustomerStatus | "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={(value) => setType(value as CustomerCategory | "all")}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeFilters.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setStatus("all"); setType("all"); }}>Reset</Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => bulkStatus("Active")}>Bulk Activate</Button>
            <Button variant="outline" size="sm" onClick={() => bulkStatus("Inactive")}>Bulk Deactivate</Button>
          </div>
        </div>
      </div>

      <PageSection title="Customer Directory">
        <AppDataGrid
          rows={rows}
          columns={columns}
          storageKey="grid:store-customers"
          checkboxSelection
          selectionModel={selection}
          onSelectionModelChange={(model) => setSelection(model as string[])}
          onRowClick={(id) => navigate(`/customers/${id}`)}
        />
      </PageSection>
    </AppLayout>
  );
}
