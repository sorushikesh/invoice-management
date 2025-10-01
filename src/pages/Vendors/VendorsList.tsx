import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getVendors, updateVendorProfile, Vendor, BusinessCategory, VendorStatus } from "@/services/data";

const statusFilters: Array<{ label: string; value: VendorStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const categoryFilters: Array<{ label: string; value: BusinessCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Manufacturer", value: "Manufacturer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Service Provider", value: "Service Provider" },
];

function buildRows(vendors: Vendor[]) {
  return vendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    contactName: vendor.contactName || "—",
    email: vendor.email || "—",
    phone: vendor.phone || "—",
    status: vendor.status,
    location: [vendor.city, vendor.country].filter(Boolean).join(", "),
    businessCategory: vendor.businessCategory,
    raw: vendor,
  }));
}

export default function VendorsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VendorStatus | "all">("all");
  const [category, setCategory] = useState<BusinessCategory | "all">("all");
  const [location, setLocation] = useState<string | "all">("all");
  const [selection, setSelection] = useState<string[]>([]);
  const [datasetVersion, setDatasetVersion] = useState(0);

  const vendors = useMemo(() => getVendors(), [datasetVersion]);

  const locationFilters = useMemo(() => {
    const unique = new Set<string>();
    vendors.forEach((v) => {
      const loc = [v.city, v.country].filter(Boolean).join(", ");
      if (loc) unique.add(loc);
    });
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [vendors]);

  const filtered = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesStatus = status === "all" || vendor.status === status;
      const matchesCategory = category === "all" || vendor.businessCategory === category;
      const loc = [vendor.city, vendor.country].filter(Boolean).join(", ");
      const matchesLocation = location === "all" || loc === location;
      const matchesSearch = search.trim().length === 0
        || vendor.name.toLowerCase().includes(search.toLowerCase())
        || (vendor.contactName || "").toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesCategory && matchesLocation && matchesSearch;
    });
  }, [vendors, status, category, location, search]);

  const rows = useMemo(() => buildRows(filtered), [filtered]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Vendor Name", flex: 1.3 },
    { field: "contactName", headerName: "Contact Person", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.2 },
    { field: "phone", headerName: "Phone", width: 160 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => <StatusBadge status={value} kind="generic" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/vendors/${row.id}`); }}>View</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/vendors/${row.id}/edit`); }}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeactivate(row.id); }}>Deactivate</Button>
        </div>
      ),
    },
  ];

  const handleDeactivate = (id: string) => {
    updateVendorProfile(id, { status: "Inactive" });
    toast({ title: "Vendor deactivated" });
    setDatasetVersion((n) => n + 1);
  };

  const handleBulkStatusChange = (next: VendorStatus) => {
    if (selection.length === 0) {
      toast({ title: "Select vendors first", variant: "destructive" });
      return;
    }
    selection.forEach((id) => updateVendorProfile(id, { status: next }));
    toast({ title: `Vendors ${next === "Active" ? "activated" : "deactivated"}` });
    setDatasetVersion((n) => n + 1);
    setSelection([]);
  };

  const handleExport = () => {
    const headers = ["Vendor Name", "Contact", "Email", "Phone", "Status", "Location", "Business Category"];
    const csv = [headers.join(","),
      ...filtered.map((vendor) => [
        `"${vendor.name}"`,
        `"${vendor.contactName || ""}"`,
        `"${vendor.email || ""}"`,
        `"${vendor.phone || ""}"`,
        vendor.status,
        `"${[vendor.city, vendor.country].filter(Boolean).join(", " )}"`,
        vendor.businessCategory,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export started", description: "Your CSV download has begun." });
  };

  const resetFilters = () => {
    setStatus("all");
    setCategory("all");
    setLocation("all");
    setSearch("");
  };

  return (
    <AppLayout
      title="Vendors"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Vendors" }]}
      actions={<Button onClick={() => navigate("/vendors/new")}>+ Add Vendor</Button>}
    >
      <div className="grid gap-4 mb-6">
        <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vendor or contact"
              className="w-64"
            />
            <Select value={status} onValueChange={(val) => setStatus(val as VendorStatus | "all") }>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(val) => setCategory(val as BusinessCategory | "all") }>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                {categoryFilters.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={(val) => setLocation(val)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locationFilters.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc === "all" ? "All Locations" : loc}</SelectItem>
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

      <PageSection title="Vendor Directory">
        <AppDataGrid
          rows={rows}
          columns={columns}
          storageKey="grid:vendors"
          checkboxSelection
          selectionModel={selection}
          onSelectionModelChange={(model) => setSelection(model as string[])}
          onRowClick={(id) => navigate(`/vendors/${id}`)}
        />
      </PageSection>
    </AppLayout>
  );
}
