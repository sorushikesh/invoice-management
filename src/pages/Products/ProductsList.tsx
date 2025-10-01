import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import ActionButton from "@/components/ActionButton";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import { actionsColumn } from "@/components/datagrid/Actions";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";

const products = [
  { id: "p-001", name: "Consulting Hours", sku: "CONS-HR", unit: "hour", price: 80 },
  { id: "p-002", name: "Website Design", sku: "WEB-DSN", unit: "project", price: 2500 },
  { id: "p-003", name: "Hosting", sku: "HOST-M", unit: "month", price: 25 },
];

export default function ProductsList() {
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "sku", headerName: "SKU", width: 140 },
    { field: "unit", headerName: "Unit", width: 120 },
    { field: "price", headerName: "Price", width: 140, valueFormatter: ({ value }) => formatCurrency(value as number), align: "right", headerAlign: "right" },
    actionsColumn({
      onView: (row) => navigate(`/products/${row.id}`),
      onEdit: (row) => navigate(`/products/${row.id}`),
      onDelete: (row) => { if (confirm(`Delete ${row.name}?`)) { /* TODO */ } },
    }),
  ];
  return (
    <AppLayout
      title="Products"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Products" }]}
      actions={<ActionButton to="/products/new">Add Product/Service</ActionButton>}
    >

      <PageSection title="Products & Services">
          <AppDataGrid futuristic={false} storageKey="grid:products" rows={products} columns={columns} getRowId={(r) => r.id} />
      </PageSection>
    </AppLayout>
  );
}



