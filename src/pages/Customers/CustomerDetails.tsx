import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/settings";
import { getStoreCustomerById, updateStoreCustomer, StoreCustomer } from "@/services/data";
import { format } from "date-fns";

const auditEntries = [
  { id: "aud-1", event: "Updated communication preference to WhatsApp", user: "Melanie Fields", at: "2025-09-12 11:20" },
  { id: "aud-2", event: "Loyalty points adjusted (+120)", user: "Melanie Fields", at: "2025-08-21 09:35" },
  { id: "aud-3", event: "Customer record created", user: "System", at: "2025-04-05 14:04" },
];

const purchaseColumns: GridColDef[] = [
  { field: "reference", headerName: "Reference", flex: 1 },
  { field: "date", headerName: "Date", width: 140, renderCell: ({ value }) => format(new Date(String(value)), "dd MMM yyyy") },
  { field: "amount", headerName: "Amount", width: 140, renderCell: ({ value }) => <span className="tabular-nums">{formatCurrency(Number(value))}</span> },
  { field: "status", headerName: "Status", width: 160 },
];

const refundColumns: GridColDef[] = [
  { field: "reference", headerName: "Reference", flex: 1 },
  { field: "date", headerName: "Date", width: 140, renderCell: ({ value }) => format(new Date(String(value)), "dd MMM yyyy") },
  { field: "amount", headerName: "Amount", width: 140, renderCell: ({ value }) => <span className="tabular-nums">{formatCurrency(Number(value))}</span> },
  { field: "reason", headerName: "Reason", flex: 1 },
];

const loyaltyColumns: GridColDef[] = [
  { field: "date", headerName: "Date", width: 140, renderCell: ({ value }) => format(new Date(String(value)), "dd MMM yyyy") },
  { field: "type", headerName: "Type", width: 120 },
  { field: "points", headerName: "Points", width: 120, renderCell: ({ value }) => <span className="tabular-nums font-semibold">{value as number}</span> },
  { field: "description", headerName: "Description", flex: 1 },
];

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customer = useMemo<StoreCustomer | undefined>(() => getStoreCustomerById(id), [id]);
  const [current, setCurrent] = useState(customer);

  useEffect(() => {
    setCurrent(customer);
  }, [customer]);

  if (!current) {
    return (
      <AppLayout title="Customer not found" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Customers", to: "/customers" }]}> 
        <PageSection title="Missing customer">
          <p>We couldn't find that customer record.</p>
          <Button className="mt-4" onClick={() => navigate("/customers")}>Back to Customers</Button>
        </PageSection>
      </AppLayout>
    );
  }

  const toggleStatus = () => {
    const nextStatus = current.status === "Active" ? "Inactive" : "Active";
    const updated = updateStoreCustomer(current.id, { status: nextStatus });
    toast({ title: nextStatus === "Active" ? "Customer activated" : "Customer deactivated" });
    if (updated) setCurrent({ ...updated });
  };

  const loyaltyBadge = current.loyaltyPoints >= 1000 ? "Gold" : current.loyaltyPoints >= 500 ? "Silver" : "Bronze";

  const overviewItems = [
    { label: "Email", value: current.email },
    { label: "Phone", value: current.phone || "—" },
    { label: "Preferred channel", value: current.preferredCommunication },
    { label: "Loyalty ID", value: current.loyaltyId || "—" },
    { label: "Customer Type", value: current.type },
    { label: "Status", value: current.status },
  ];

  return (
    <AppLayout
      title="Customer Profile"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Customers", to: "/customers" }, { label: current.name }]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{current.name}</h1>
                <StatusBadge status={current.status} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Loyalty Badge:</span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary font-medium uppercase tracking-wide text-xs">{loyaltyBadge}</span>
                <span className="px-2 text-xs text-muted-foreground">{current.loyaltyPoints} pts</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/customers/${current.id}/edit`)}>Edit</Button>
              <Button variant="outline" onClick={toggleStatus}>{current.status === "Active" ? "Deactivate" : "Activate"}</Button>
              <Button onClick={() => navigate("/customers/new")}>Add Customer</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <PageSection>
              <Tabs defaultValue="overview">
                <TabsList textColor="primary" indicatorColor="primary">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                  <TabsTrigger value="refunds">Refunds / Returns</TabsTrigger>
                  <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
                  <TabsTrigger value="audit">Audit Log</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-4">
                  <Card className="p-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold">Contact & Preferences</h3>
                      <Separator className="my-2" />
                    </div>
                    <dl className="grid gap-y-2 md:grid-cols-2 text-sm">
                      {overviewItems.map((item) => (
                        <div key={item.label} className="flex flex-col">
                          <span className="text-xs uppercase text-muted-foreground tracking-wide">{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </dl>
                    {current.type === "Business" && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">KYC Documents</h4>
                        {current.kycDocuments?.length ? (
                          <ul className="space-y-1 text-sm">
                            {current.kycDocuments.map((doc) => (
                              <li key={doc.id}>{doc.kind}: {doc.name} (uploaded {format(new Date(doc.uploaded), "dd MMM yyyy")})</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No KYC files on record.</p>
                        )}
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="purchases" className="pt-4 space-y-4">
                  <AppDataGrid
                    rows={current.purchaseHistory}
                    columns={purchaseColumns}
                    storageKey={`grid:store-customer:${current.id}:purchases`}
                    emptyMessage="No purchases recorded yet"
                  />
                </TabsContent>

                <TabsContent value="refunds" className="pt-4 space-y-4">
                  <AppDataGrid
                    rows={current.refunds}
                    columns={refundColumns}
                    storageKey={`grid:store-customer:${current.id}:refunds`}
                    emptyMessage="No refunds or returns processed"
                  />
                </TabsContent>

                <TabsContent value="loyalty" className="pt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                    <div>
                      <h3 className="text-sm font-semibold">Total Points</h3>
                      <p className="text-2xl font-bold tabular-nums">{current.loyaltyPoints}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Loyalty adjustment coming soon" })}>Adjust Points</Button>
                  </div>
                  <AppDataGrid
                    rows={current.loyaltyHistory}
                    columns={loyaltyColumns}
                    storageKey={`grid:store-customer:${current.id}:loyalty`}
                    emptyMessage="No loyalty activity yet"
                  />
                </TabsContent>

                <TabsContent value="audit" className="pt-4 space-y-4">
                  {auditEntries.map((entry) => (
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
                </TabsContent>
              </Tabs>
            </PageSection>
          </div>

          <aside className="space-y-4">
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold">Customer Snapshot</h3>
              <Separator className="my-2" />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{format(new Date(current.createdAt), "dd MMM yyyy")}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>{current.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd>{current.notes || "—"}</dd>
                </div>
              </dl>
            </Card>
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
              <Separator className="my-2" />
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => toast({ title: "Message feature coming soon" })}>Send Message</Button>
                <Button variant="outline" onClick={() => toast({ title: "Statement download coming soon" })}>Download Statement</Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

