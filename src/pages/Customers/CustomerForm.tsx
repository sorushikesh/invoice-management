import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createStoreCustomer, getStoreCustomerById, updateStoreCustomer, CustomerCategory, CommunicationPreference, CustomerStatus, StoreCustomerDocument } from "@/services/data";

const customerTypes: CustomerCategory[] = ["Individual", "Business"];
const statusOptions: CustomerStatus[] = ["Active", "Inactive"];
const communicationOptions: CommunicationPreference[] = ["Email", "SMS", "WhatsApp"];

const schema = z.object({
  status: z.enum(["Active", "Inactive"]).default("Active"),
  name: z.string().min(2, "Customer name is required"),
  type: z.enum(["Individual", "Business"]),
  loyaltyId: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(4, "Phone number is required"),
  preferredCommunication: z.enum(["Email", "SMS", "WhatsApp"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const steps = [
  { id: "info", label: "Personal / Business Info" },
  { id: "contact", label: "Contact Details" },
  { id: "kyc", label: "KYC Documents" },
  { id: "review", label: "Review & Save" },
] as const;

type KycKind = "ID Proof" | "Address Proof";

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editing = Boolean(id);
  const existing = useMemo(() => (id ? getStoreCustomerById(id) : undefined), [id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: existing?.status || "Active",
      name: existing?.name || "",
      type: existing?.type || "Individual",
      loyaltyId: existing?.loyaltyId || "",
      email: existing?.email || "",
      phone: existing?.phone || "",
      preferredCommunication: existing?.preferredCommunication || "Email",
      notes: existing?.notes || ""
    },
  });

  const [activeTab, setActiveTab] = useState<typeof steps[number]["id"]>(steps[0].id);
  const [kycDocs, setKycDocs] = useState<StoreCustomerDocument[]>(existing?.kycDocuments || []);

  if (editing && !existing) {
    return (
      <AppLayout title="Customer not found" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Customers", to: "/customers" }]}> 
        <PageSection title="Missing customer">We could not locate the requested customer.</PageSection>
      </AppLayout>
    );
  }

  const currentIndex = steps.findIndex((step) => step.id === activeTab);

  const goToStep = (delta: number) => {
    const nextIndex = Math.min(Math.max(currentIndex + delta, 0), steps.length - 1);
    setActiveTab(steps[nextIndex].id);
  };

  const validateStepAndContinue = async () => {
    const fieldsByStep: Record<typeof steps[number]["id"], (keyof FormValues)[]> = {
      info: ["status", "name", "type", "loyaltyId"],
      contact: ["email", "phone", "preferredCommunication", "notes"],
      kyc: [],
      review: [],
    };
    const valid = await form.trigger(fieldsByStep[activeTab] || []);
    if (valid) goToStep(1);
  };

  const handleUpload = (kind: KycKind, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const now = new Date().toISOString().slice(0, 10);
    const additions = Array.from(files).map<StoreCustomerDocument>((file, idx) => ({
      id: `${kind === "ID Proof" ? "id" : "addr"}-${Date.now()}-${idx}`,
      kind,
      name: file.name,
      uploaded: now,
    }));
    setKycDocs((prev) => [...prev.filter((doc) => doc.kind !== kind), ...additions]);
    toast({ title: `${kind} uploaded`, description: `${additions.length} file${additions.length === 1 ? "" : "s"} ready to save.` });
  };

  const removeDocument = (docId: string) => {
    setKycDocs((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const onSubmit = (values: FormValues) => {
    const preferred = values.preferredCommunication;
    const payload = {
      status: values.status,
      name: values.name,
      type: values.type,
      loyaltyId: values.loyaltyId || undefined,
      email: values.email,
      phone: values.phone,
      preferredCommunication: preferred,
      kycDocuments: values.type === "Business" ? kycDocs : undefined,
      notes: values.notes,
    };

    if (editing && existing) {
      updateStoreCustomer(existing.id, {
        ...payload,
        loyaltyPoints: existing.loyaltyPoints,
      });
      toast({ title: "Customer updated", description: `${values.name} has been saved.` });
      navigate(`/customers/${existing.id}`);
    } else {
      const created = createStoreCustomer({ ...payload, loyaltyPoints: 0 });
      toast({ title: "Customer created", description: `${values.name} has been added.` });
      navigate(`/customers/${created.id}`);
    }
  };

  const footerButtons = (
    <div className="flex items-center justify-between pt-6">
      <Button type="button" variant="outline" disabled={currentIndex === 0} onClick={() => goToStep(-1)}>
        Back
      </Button>
      {activeTab === "review" ? (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/customers")}>Cancel</Button>
          <Button type="submit">Save Customer</Button>
        </div>
      ) : (
        <Button type="button" onClick={validateStepAndContinue}>
          Next
        </Button>
      )}
    </div>
  );

  return (
    <AppLayout
      title={editing ? `Edit ${existing?.name}` : "Add Customer"}
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Customers", to: "/customers" }, { label: editing ? "Edit" : "New" }]}
    >
      <PageSection>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof steps[number]["id"]) }>
            <TabsList textColor="primary" indicatorColor="primary">
              {steps.map((step) => (
                <TabsTrigger key={step.id} value={step.id}>{step.label}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as CustomerStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Customer Type</Label>
                  <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as CustomerCategory)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customerTypes.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loyaltyId">Loyalty ID</Label>
                  <Input id="loyaltyId" placeholder="Optional" {...form.register("loyaltyId")} />
                </div>
              </div>
              {footerButtons}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("phone")} />
                  {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Preferred Communication</Label>
                  <Select value={form.watch("preferredCommunication")} onValueChange={(value) => form.setValue("preferredCommunication", value as CommunicationPreference)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {communicationOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" rows={3} placeholder="Internal notes (optional)" {...form.register("notes")} />
                </div>
              </div>
              {footerButtons}
            </TabsContent>

            <TabsContent value="kyc" className="space-y-6">
              {form.watch("type") === "Business" ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {(["ID Proof", "Address Proof"] as KycKind[]).map((kind) => (
                      <div key={kind} className="space-y-2">
                        <Label>{kind}</Label>
                        <div className="flex items-center gap-2">
                          <input
                            id={`file-${kind}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => handleUpload(kind, e.target.files)}
                          />
                          <Button type="button" variant="outline" onClick={() => document.getElementById(`file-${kind}`)?.click()}>
                            Upload {kind}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Uploaded Documents</Label>
                    {kycDocs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {kycDocs.map((doc) => (
                          <li key={doc.id} className="flex items-center justify-between rounded border p-2">
                            <span>{doc.kind} — {doc.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeDocument(doc.id)}>Remove</Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">KYC documents are only required for business customers.</p>
              )}
              {footerButtons}
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Summary</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd>{form.watch("name")}</dd>
                    <dt className="text-muted-foreground">Type</dt>
                    <dd>{form.watch("type")}</dd>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>{form.watch("status")}</dd>
                    <dt className="text-muted-foreground">Loyalty ID</dt>
                    <dd>{form.watch("loyaltyId") || "—"}</dd>
                  </dl>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Contact</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{form.watch("email")}</dd>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>{form.watch("phone")}</dd>
                    <dt className="text-muted-foreground">Communication</dt>
                    <dd>{form.watch("preferredCommunication")}</dd>
                  </dl>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4 md:col-span-2">
                  <h3 className="text-sm font-semibold mb-3">KYC</h3>
                  {form.watch("type") === "Business" ? (
                    kycDocs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {kycDocs.map((doc) => (
                          <li key={doc.id}>{doc.kind} — {doc.name}</li>
                        ))}
                      </ul>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">KYC not required for individual customers.</p>
                  )}
                </div>
              </div>
              {footerButtons}
            </TabsContent>
          </Tabs>
        </form>
      </PageSection>
    </AppLayout>
  );
}



