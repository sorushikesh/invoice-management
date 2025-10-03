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
import { formatCurrency } from "@/lib/settings";
import { getStoreCustomers, getCustomerBalance, updateStoreCustomer, StoreCustomer, CustomerSize, CustomerStatus } from "@/services/data";

const statusOptions: Array<{ label: string; value: CustomerStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const sizeOptions: Array<{ label: string; value: CustomerSize | "all" }> = [
  { label: "All", value: "all" },
  { label: "Small", value: "Small" },
  { label: "Medium", value: "Medium" },
  { label: "Enterprise", value: "Enterprise" },
];

type Row = {
  id: string;
  name: string;
  creditLimit: number;
  outstanding: number;
  contactName: string;
  status: CustomerStatus;
  primaryEmail: string;
};

function buildRows(customers: StoreCustomer[]): Row[] {
  return customers.map((customer) => {
    const balance = getCustomerBalance(customer.id);
    return {
      id: customer.id,
      name: customer.name,
      creditLimit: 0, // StoreCustomer doesn't have creditLimit
      outstanding: balance.due,
      contactName: customer.name,
      status: customer.status,
      primaryEmail: customer.email,
    };
  });
}

export default function ClientsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [size, setSize] = useState<CustomerSize | "all">("all");
  const [selection, setSelection] = useState<string[]>([]);
  const [datasetVersion, setDatasetVersion] = useState(0);

  const customers = useMemo(() => getStoreCustomers(), [datasetVersion]);

  const filtered = useMemo(() => {
    return customers.filter((customer) => {
      const matchesStatus = status === "all" || customer.status === status;
      const matchesSize = size === "all"; // StoreCustomer doesn't have size field
      const term = search.trim().toLowerCase();
      const matchesSearch = term.length === 0
        || customer.name.toLowerCase().includes(term)
        || customer.email.toLowerCase().includes(term);
      return matchesStatus && matchesSize && matchesSearch;
    });
  }, [customers, status, size, search]);

  const rows = useMemo(() => buildRows(filtered), [filtered]);

  const toggleStatus = (id: string, next: CustomerStatus) => {
    updateStoreCustomer(id, { status: next });
    toast({ title: `Client ${next === "Active" ? "activated" : "deactivated"}` });
    setDatasetVersion((v) => v + 1);
  };

  const handleBulkStatusChange = (next: CustomerStatus) => {
    if (selection.length === 0) {
      toast({ title: "No clients selected", variant: "destructive" });
      return;
    }
    selection.forEach((id) => updateStoreCustomer(id, { status: next }));
    toast({ title: `Clients ${next === "Active" ? "activated" : "deactivated"}` });
    setDatasetVersion((v) => v + 1);
    setSelection([]);
  };

  const handleExport = () => {
    const headers = ["Client Name", "Credit Limit", "Outstanding", "Contact", "Email", "Status"];
    const csv = [
      headers.join(","),
      ...filtered.map((customer) => {
        const balance = getCustomerBalance(customer.id);
        return [
          `"${customer.name}"`,
          "0.00", // No creditLimit in StoreCustomer
          balance.due.toFixed(2),
          `"${customer.name}"`, // Using customer name as contact
          `"${customer.email}"`,
          customer.status,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clients.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export started", description: "Client data download in progress." });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setSize("all");
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Client Name", flex: 1.4 },
    {
      field: "creditLimit",
      headerName: "Credit Limit",
      width: 160,
      renderCell: ({ value }) => <span className="tabular-nums">{formatCurrency(value as number)}</span>,
    },
    {
      field: "outstanding",
      headerName: "Outstanding Amount",
      width: 180,
      renderCell: ({ value }) => <span className="tabular-nums">{formatCurrency(value as number)}</span>,
    },
    { field: "contactName", headerName: "Contact Person", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => <StatusBadge status={String(value)} kind="generic" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${row.id}`);
            }}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${row.id}/edit`);
            }}
          >
            Edit
          </Button>
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
      title="Clients"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Clients" }]}
      actions={<Button onClick={() => navigate("/clients/new")}>+ Add Client</Button>}
    >
      <div className="grid gap-4 mb-6">
        <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, contact, or email"
              className="w-64"
            />
            <Select value={status} onValueChange={(value) => setStatus(value as CustomerStatus | "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={size} onValueChange={(value) => setSize(value as CustomerSize | "all")}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange("Active")}>Bulk Activate</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange("Inactive")}>Bulk Deactivate</Button>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExport}>Export</Button>
        </div>
      </div>

      <PageSection title="Client Directory">
        <AppDataGrid
          rows={rows}
          columns={columns}
          storageKey="grid:clients"
          checkboxSelection
          selectionModel={selection}
          onSelectionModelChange={(model) => setSelection(model as string[])}
          onRowClick={(id) => navigate(`/clients/${id}`)}
        />
      </PageSection>
    </AppLayout>
  );
}
