import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import AppDataGrid, { GridColDef } from "@/components/datagrid/AppDataGrid";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/settings";
import { getCustomerBalance, getCustomerById, getInvoicesByCustomerId, updateCustomerProfile, Customer, CustomerContact } from "@/services/data";
import { format, differenceInCalendarDays } from "date-fns";

const auditTrail = [
  { id: "log-1", event: "Updated credit limit to 25,000", user: "Andrea Hudson", at: "2025-09-18 10:12" },
  { id: "log-2", event: "Added new billing contact (Mark Chen)", user: "Andrea Hudson", at: "2025-09-12 09:05" },
  { id: "log-3", event: "Client record created", user: "Ethan Walker", at: "2025-01-02 08:30" },
];

const fallbackDocuments = [
  { id: "doc-1", name: "Master Service Agreement.pdf", type: "Contract", size: "1.2 MB", updated: "2025-01-05" },
  { id: "doc-2", name: "W-9 Certificate.pdf", type: "Tax", size: "340 KB", updated: "2025-01-04" },
];

const invoiceColumns: GridColDef[] = [
  { field: "number", headerName: "Invoice", flex: 1 },
  { field: "date", headerName: "Issued", width: 140, renderCell: ({ value }) => format(new Date(String(value)), "dd MMM yyyy") },
  { field: "due", headerName: "Due", width: 140, renderCell: ({ value }) => format(new Date(String(value)), "dd MMM yyyy") },
  { field: "amount", headerName: "Amount", width: 140, renderCell: ({ value }) => <span className="tabular-nums">{formatCurrency(Number(value))}</span> },
  { field: "status", headerName: "Status", width: 140, renderCell: ({ value }) => <StatusBadge status={String(value)} kind="invoice" /> },
];

function calculateAging(invoices: ReturnType<typeof getInvoicesByCustomerId>) {
  return invoices.reduce(
    (acc, invoice) => {
      const dueDays = differenceInCalendarDays(new Date(), new Date(invoice.due));
      if (dueDays <= 0) acc.current += invoice.amount;
      else if (dueDays <= 30) acc["1-30"] += invoice.amount;
      else if (dueDays <= 60) acc["31-60"] += invoice.amount;
      else if (dueDays <= 90) acc["61-90"] += invoice.amount;
      else acc["90+"] += invoice.amount;
      return acc;
    },
    { current: 0, "1-30": 0, "31-60": 0, "61-90": 0, "90+": 0 },
  );
}

function makeContactId(clientId: string) {
  return `ct-${clientId}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const baseCustomer = useMemo<Customer | undefined>(() => getCustomerById(id), [id]);
  const [customer, setCustomer] = useState<Customer | undefined>(baseCustomer);

  useEffect(() => {
    setCustomer(baseCustomer);
  }, [baseCustomer]);

  const invoices = useMemo(() => (customer ? getInvoicesByCustomerId(customer.id) : []), [customer?.id]);
  const balance = useMemo(() => (customer ? getCustomerBalance(customer.id) : { total: 0, paid: 0, due: 0, overdue: 0 }), [customer?.id]);
  const aging = useMemo(() => calculateAging(invoices), [invoices]);

  const [newContact, setNewContact] = useState({ name: "", role: "", email: "", phone: "" });

  useEffect(() => {
    setNewContact({ name: "", role: "", email: "", phone: "" });
  }, [customer?.id]);

  if (!customer) {
    return (
      <AppLayout title="Client not found" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Clients", to: "/clients" }]}>
        <PageSection title="Missing client">
          <p>We couldn’t locate the client record.</p>
          <Button className="mt-4" onClick={() => navigate("/clients")}>Back to Clients</Button>
        </PageSection>
      </AppLayout>
    );
  }

  const creditLimit = customer.creditLimit || 0;
  const creditUsed = balance.due;
  const creditAvailable = Math.max(creditLimit - creditUsed, 0);
  const utilization = creditLimit > 0 ? Math.min((creditUsed / creditLimit) * 100, 100) : 0;

  const documents = customer.documents?.length ? customer.documents : fallbackDocuments;

  const contacts = customer.contacts;

  const toggleStatus = () => {
    const nextStatus = customer.status === "Active" ? "Inactive" : "Active";
    const updated = updateCustomerProfile(customer.id, { status: nextStatus });
    toast({ title: nextStatus === "Active" ? "Client activated" : "Client deactivated" });
    if (updated) setCustomer({ ...updated });
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) {
      toast({ title: "Contact name and email required", variant: "destructive" });
      return;
    }
    const contact: CustomerContact = {
      id: makeContactId(customer.id),
      name: newContact.name.trim(),
      role: newContact.role.trim() || undefined,
      email: newContact.email.trim(),
      phone: newContact.phone.trim() || undefined,
    };
    const updated = updateCustomerProfile(customer.id, { contacts: [...contacts, contact] });
    if (updated) {
      setCustomer({ ...updated });
      setNewContact({ name: "", role: "", email: "", phone: "" });
      toast({ title: "Contact added" });
    }
  };

  const handleRemoveContact = (contactId: string) => {
    if (contacts.length <= 1) {
      toast({ title: "At least one contact is required", variant: "destructive" });
      return;
    }
    const filtered = contacts.filter((contact) => contact.id !== contactId);
    const updated = updateCustomerProfile(customer.id, { contacts: filtered });
    if (updated) {
      setCustomer({ ...updated });
      toast({ title: "Contact removed" });
    }
  };

  const quickInfo = [
    { label: "Credit Limit", value: formatCurrency(creditLimit) },
    { label: "Outstanding", value: formatCurrency(creditUsed) },
    { label: "Available", value: formatCurrency(creditAvailable) },
    { label: "Recurring Invoices", value: customer.recurringInvoices ? "Enabled" : "Disabled" },
    { label: "Payment Terms", value: customer.paymentTerms || "Net 30" },
    { label: "Contract", value: customer.contractStart ? `${format(new Date(customer.contractStart), "dd MMM yyyy")} ? ${customer.contractEnd ? format(new Date(customer.contractEnd), "dd MMM yyyy") : "Open"}` : "—" },
  ];

  return (
    <AppLayout
      title="Client Profile"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Clients", to: "/clients" }, { label: customer.name }]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{customer.name}</h1>
                <StatusBadge status={customer.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {customer.size} • {customer.registrationNumber || "Registration pending"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/clients/${customer.id}/edit`)}>Edit</Button>
              <Button variant="outline" onClick={toggleStatus}>
                {customer.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
              <Button onClick={() => navigate("/invoices/new")}>New Invoice</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{formatCurrency(creditUsed)} used</span>
              <span>{formatCurrency(creditAvailable)} available</span>
            </div>
            <Progress value={utilization} aria-label="Credit utilisation" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <PageSection>
              <Tabs defaultValue="overview">
                <TabsList textColor="primary" indicatorColor="primary">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="audit">Audit Log</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-4 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold">Business Information</h3>
                        <Separator className="my-2" />
                      </div>
                      <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                        <Label className="text-muted-foreground">Size</Label>
                        <span>{customer.size}</span>
                        <Label className="text-muted-foreground">Registration No.</Label>
                        <span>{customer.registrationNumber || "—"}</span>
                        <Label className="text-muted-foreground">Tax ID</Label>
                        <span>{customer.taxId || "—"}</span>
                        <Label className="text-muted-foreground">Address</Label>
                        <span>{[customer.addressLine1, customer.city, customer.state, customer.postalCode, customer.country].filter(Boolean).join(", ") || "Address not provided"}</span>
                      </div>
                    </Card>
                    <Card className="p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold">Credit Terms</h3>
                        <Separator className="my-2" />
                      </div>
                      <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                        <Label className="text-muted-foreground">Credit Limit</Label>
                        <span>{formatCurrency(creditLimit)}</span>
                        <Label className="text-muted-foreground">Outstanding</Label>
                        <span>{formatCurrency(creditUsed)}</span>
                        <Label className="text-muted-foreground">Available</Label>
                        <span>{formatCurrency(creditAvailable)}</span>
                        <Label className="text-muted-foreground">Recurring Invoices</Label>
                        <span>{customer.recurringInvoices ? "Enabled" : "Disabled"}</span>
                        <Label className="text-muted-foreground">Payment Terms</Label>
                        <span>{customer.paymentTerms || "Net 30"}</span>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="invoices" className="pt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-5">
                    {Object.entries(aging).map(([bucket, amount]) => (
                      <Card key={bucket} className="p-4">
                        <p className="text-xs text-muted-foreground uppercase">{bucket}</p>
                        <p className="text-sm font-semibold tabular-nums">{formatCurrency(amount)}</p>
                      </Card>
                    ))}
                  </div>
                  <AppDataGrid
                    rows={invoices}
                    columns={invoiceColumns}
                    storageKey={`grid:client:${customer.id}:invoices`}
                    emptyMessage="No invoices linked yet"
                  />
                </TabsContent>

                <TabsContent value="contacts" className="pt-4 space-y-4">
                  <div className="grid gap-4">
                    {contacts.map((contact, index) => (
                      <Card key={contact.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.role || "—"}</p>
                            <p className="text-sm mt-1">{contact.email}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone || "—"}</p>
                          </div>
                          {index !== 0 && (
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveContact(contact.id)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="grid gap-3 rounded-lg border bg-muted/40 p-4">
                    <div className="grid gap-3 md:grid-cols-4">
                      <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))} />
                      <Input placeholder="Role" value={newContact.role} onChange={(e) => setNewContact((prev) => ({ ...prev, role: e.target.value }))} />
                      <Input placeholder="Email" value={newContact.email} onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))} />
                      <Input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))} />
                    </div>
                    <Button className="w-fit" onClick={handleAddContact}>
                      Add Contact
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="pt-4 space-y-4">
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Upload coming soon" })}>Upload Document</Button>
                  </div>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <Card key={doc.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} | {doc.size} | Updated {format(new Date(doc.updated), "dd MMM yyyy")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toast({ title: "Downloading", description: doc.name })}>Download</Button>
                          <Button variant="ghost" size="sm" onClick={() => toast({ title: "Preview coming soon" })}>Preview</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="pt-4 space-y-4">
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
              <h3 className="text-sm font-semibold">Billing Email</h3>
              <Separator className="my-2" />
              <p className="text-sm">{customer.email}</p>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
