import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/settings";
import { getExpensesByVendorId, getVendorById, updateVendorProfile, Vendor } from "@/services/data";
import { format } from "date-fns";

const auditTrail = [
  { id: "a1", event: "Updated payment terms to Net 30", user: "Elena Fisher", at: "2025-09-21 14:20" },
  { id: "a2", event: "Uploaded compliance documents", user: "Sam Drake", at: "2025-09-18 11:05" },
  { id: "a3", event: "Created vendor record", user: "Nathan Drake", at: "2025-08-10 09:42" },
];

const sampleDocuments = [
  { id: "d1", name: "Master Service Agreement.pdf", type: "Contract", size: "1.2 MB", updated: "2025-09-18" },
  { id: "d2", name: "W-9 Form.pdf", type: "Tax", size: "320 KB", updated: "2025-09-01" },
  { id: "d3", name: "KYC Verification.zip", type: "KYC", size: "2.4 MB", updated: "2025-08-29" },
];

export default function VendorDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const baseVendor = useMemo<Vendor | undefined>(() => getVendorById(id), [id]);
  const [vendor, setVendor] = useState<Vendor | undefined>(baseVendor);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    setVendor(baseVendor);
  }, [baseVendor]);

  const expenses = useMemo(() => (id ? getExpensesByVendorId(id) : []), [id]);
  const transactions = useMemo(() => expenses.map((expense, idx) => ({
    id: `${expense.id}-${idx}`,
    reference: expense.id,
    type: expense.category,
    date: expense.date,
    amount: expense.amount,
    status: "Completed",
  })), [expenses]);

  const transactionColumns: GridColDef[] = [
    { field: "reference", headerName: "Reference", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "amount", headerName: "Amount", width: 140, renderCell: ({ value }) => formatCurrency(value as number), sortable: false },
    { field: "status", headerName: "Status", width: 140, renderCell: ({ value }) => <StatusBadge status={value} /> },
  ];

  const currentVendor = vendor ?? baseVendor;

  if (!currentVendor) {
    return (
      <AppLayout title="Vendor not found" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Vendors", to: "/vendors" }]}>
        <PageSection title="Missing Vendor">
          <p>We couldn’t locate the vendor record.</p>
          <Button className="mt-4" onClick={() => navigate("/vendors")}>Back to Vendors</Button>
        </PageSection>
      </AppLayout>
    );
  }

  const handleToggleStatus = () => {
    const nextStatus = currentVendor.status === "Active" ? "Inactive" : "Active";
    const updated = updateVendorProfile(currentVendor.id, { status: nextStatus });
    toast({ title: nextStatus === "Inactive" ? "Vendor deactivated" : "Vendor activated" });
    if (updated) setVendor({ ...updated });
  };

  const quickInfo = [
    { label: "Rating", value: `${(currentVendor.rating ?? 0).toFixed(1)} / 5` },
    { label: "Payment Terms", value: currentVendor.paymentTerms || "Net 30" },
    { label: "Upcoming Contract Expiry", value: currentVendor.upcomingContractExpiry ? format(new Date(currentVendor.upcomingContractExpiry), "dd MMM yyyy") : "—" },
  ];

  return (
    <AppLayout
      title="Vendor Profile"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Vendors", to: "/vendors" }, { label: currentVendor.name }]}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{currentVendor.name}</h1>
              <StatusBadge status={currentVendor.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {currentVendor.businessCategory} · {[currentVendor.city, currentVendor.country].filter(Boolean).join(", ") || "Location pending"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/vendors/${currentVendor.id}/edit`)}>Edit</Button>
            <Button variant="outline" onClick={handleToggleStatus}>
              {currentVendor.status === "Active" ? "Deactivate" : "Activate"}
            </Button>
            <Button onClick={() => navigate("/invoices/new")}>Add Invoice</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <PageSection>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList textColor="primary" indicatorColor="primary">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-4 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold">Business Information</h3>
                        <Separator className="my-2" />
                      </div>
                      <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                        <Label className="text-muted-foreground">Registration No.</Label>
                        <span>{currentVendor.registrationNumber || "—"}</span>
                        <Label className="text-muted-foreground">Category</Label>
                        <span>{currentVendor.businessCategory}</span>
                        <Label className="text-muted-foreground">Tax ID</Label>
                        <span>{currentVendor.taxId || "—"}</span>
                        <Label className="text-muted-foreground">Website</Label>
                        <span>
                          {currentVendor.website ? (
                            <a className="text-primary underline" href={currentVendor.website} target="_blank" rel="noreferrer">
                              {currentVendor.website}
                            </a>
                          ) : (
                            "—"
                          )}
                        </span>
                      </div>
                    </Card>

                    <Card className="p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold">Primary Contact</h3>
                        <Separator className="my-2" />
                      </div>
                      <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                        <Label className="text-muted-foreground">Contact</Label>
                        <span>{currentVendor.contactName || "—"}</span>
                        <Label className="text-muted-foreground">Email</Label>
                        <span>{currentVendor.email || "—"}</span>
                        <Label className="text-muted-foreground">Phone</Label>
                        <span>{currentVendor.phone || "—"}</span>
                      </div>
                    </Card>

                    <Card className="md:col-span-2 p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold">Address</h3>
                        <Separator className="my-2" />
                      </div>
                      <p className="text-sm leading-relaxed">
                        {[currentVendor.addressLine1, currentVendor.city, currentVendor.state, currentVendor.postalCode, currentVendor.country].filter(Boolean).join(", ") || "Address not provided"}
                      </p>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="transactions" className="pt-4">
                  <AppDataGrid
                    rows={transactions}
                    columns={transactionColumns}
                    storageKey={`grid:vendor:${currentVendor.id}:transactions`}
                    emptyMessage="No financial activity recorded yet"
                  />
                </TabsContent>

                <TabsContent value="documents" className="pt-4 space-y-4">
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Upload coming soon" })}>Upload Document</Button>
                  </div>
                  <div className="space-y-3">
                    {sampleDocuments.map((doc) => (
                      <Card key={doc.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} | {doc.size} | Updated {format(new Date(doc.updated), "dd MMM yyyy")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toast({ title: "Downloading", description: doc.name })}>Download</Button>
                          <Button variant="ghost" size="sm" onClick={() => toast({ title: "Document preview coming soon" })}>Preview</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="pt-4">
                  <div className="space-y-4">
                    {auditTrail.map((entry) => (
                      <Card key={entry.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{entry.event}</p>
                            <p className="text-xs text-muted-foreground">{entry.user}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{entry.at}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </PageSection>
          </div>

          <aside className="space-y-4">
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold">Quick Info</h3>
              <Separator className="my-2" />
              <dl className="space-y-3 text-sm">
                {quickInfo.map((item) => (
                  <div key={item.label}>
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold">Account Details</h3>
              <Separator className="my-2" />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd>{currentVendor.bankName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Account</dt>
                  <dd>{currentVendor.bankAccountNumber || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">IFSC / SWIFT</dt>
                  <dd>{currentVendor.bankSwift || "—"}</dd>
                </div>
              </dl>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

