import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/settings";
import { createCustomer, getCustomerById, updateCustomerProfile, CustomerContact, CustomerSize, CustomerStatus } from "@/services/data";
import { Plus, Trash2 } from "lucide-react";

const sizes: CustomerSize[] = ["Small", "Medium", "Enterprise"];
const statuses: CustomerStatus[] = ["Active", "Inactive"];

const schema = z.object({
  status: z.enum(["Active", "Inactive"]),
  name: z.string().min(2, "Name is required"),
  size: z.enum(["Small", "Medium", "Enterprise"]),
  registrationNumber: z.string().min(1, "Registration number required"),
  taxId: z.string().optional(),
  creditLimit: z.coerce.number({ invalid_type_error: "Enter a credit limit" }).min(0, "Credit limit must be positive"),
  recurringInvoices: z.boolean(),
  contractStart: z.string().optional().or(z.literal("")),
  contractEnd: z.string().optional().or(z.literal("")),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  primaryContactName: z.string().min(2, "Primary contact required"),
  primaryContactRole: z.string().optional(),
  primaryContactEmail: z.string().email("Valid email required"),
  primaryContactPhone: z.string().min(4, "Phone required"),
  street: z.string().min(2, "Street required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  postalCode: z.string().min(2, "Postal code required"),
  country: z.string().min(2, "Country required"),
  additionalContacts: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name required"),
    role: z.string().optional(),
    email: z.string().email("Valid email"),
    phone: z.string().optional(),
  })).default([]),
});

type FormValues = z.infer<typeof schema>;

const steps = [
  { id: "business", label: "Business Info" },
  { id: "financial", label: "Financial Terms" },
  { id: "contact", label: "Contact & Address" },
  { id: "review", label: "Review & Save" },
] as const;

function ensureContactId(contact: Omit<CustomerContact, "id"> & { id?: string }, seed: string, index: number): CustomerContact {
  return {
    id: contact.id || `ct-${seed}-${index}`,
    name: contact.name,
    role: contact.role,
    email: contact.email,
    phone: contact.phone,
  };
}

export default function ClientRegister() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editing = Boolean(id);
  const existing = useMemo(() => (id ? getCustomerById(id) : undefined), [id]);

  const defaultContacts = useMemo(() => existing?.contacts?.slice(1) || [], [existing?.contacts]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: existing?.status || "Active",
      name: existing?.name || "",
      size: existing?.size || "Small",
      registrationNumber: existing?.registrationNumber || "",
      taxId: existing?.taxId || "",
      creditLimit: existing?.creditLimit ?? 0,
      recurringInvoices: existing?.recurringInvoices ?? true,
      contractStart: existing?.contractStart || "",
      contractEnd: existing?.contractEnd || "",
      paymentTerms: existing?.paymentTerms || "Net 30",
      notes: existing?.notes || "",
      primaryContactName: existing?.contactName || existing?.contacts[0]?.name || "",
      primaryContactRole: existing?.contactRole || existing?.contacts[0]?.role || "",
      primaryContactEmail: existing?.email || existing?.contacts[0]?.email || "",
      primaryContactPhone: existing?.contacts[0]?.phone || existing?.phone || "",
      street: existing?.addressLine1 || "",
      city: existing?.city || "",
      state: existing?.state || "",
      postalCode: existing?.postalCode || "",
      country: existing?.country || "United States",
      additionalContacts: defaultContacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        role: contact.role,
        email: contact.email,
        phone: contact.phone,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "additionalContacts" });
  const [activeTab, setActiveTab] = useState<typeof steps[number]["id"]>(steps[0].id);

  if (editing && !existing) {
    return (
      <AppLayout title="Client not found" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Clients", to: "/clients" }]}>
        <PageSection title="Missing client">The client you are trying to edit could not be located.</PageSection>
      </AppLayout>
    );
  }

  const currentStepIndex = steps.findIndex((step) => step.id === activeTab);

  const moveStep = (delta: number) => {
    const nextIndex = Math.min(Math.max(0, currentStepIndex + delta), steps.length - 1);
    setActiveTab(steps[nextIndex].id);
  };

  const validateAndNext = async () => {
    const fieldsByStep: Record<string, (keyof FormValues)[]> = {
      business: ["status", "name", "size", "registrationNumber", "taxId"],
      financial: ["creditLimit", "recurringInvoices", "contractStart", "contractEnd", "paymentTerms", "notes"],
      contact: ["primaryContactName", "primaryContactEmail", "primaryContactPhone", "street", "city", "state", "postalCode", "country", "additionalContacts"],
      review: [],
    };
    const result = await form.trigger(fieldsByStep[activeTab] || []);
    if (result) moveStep(1);
  };

  const handleSubmitForm = (values: FormValues) => {
    const seed = (existing?.id || Math.random().toString(36).slice(2, 8)).toUpperCase();
    const primaryContact = ensureContactId(
      {
        id: existing?.contacts[0]?.id,
        name: values.primaryContactName,
        role: values.primaryContactRole,
        email: values.primaryContactEmail,
        phone: values.primaryContactPhone,
      },
      seed,
      0,
    );
    const additionalContacts = values.additionalContacts.map((contact, idx) => ensureContactId(contact, seed, idx + 1));

    const payload = {
      status: values.status,
      name: values.name,
      size: values.size,
      registrationNumber: values.registrationNumber,
      taxId: values.taxId,
      creditLimit: values.creditLimit,
      recurringInvoices: values.recurringInvoices,
      contractStart: values.contractStart || undefined,
      contractEnd: values.contractEnd || undefined,
      paymentTerms: values.paymentTerms,
      notes: values.notes,
      contactName: values.primaryContactName,
      contactRole: values.primaryContactRole,
      email: values.primaryContactEmail,
      phone: values.primaryContactPhone,
      addressLine1: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      contacts: [primaryContact, ...additionalContacts],
    };

    if (editing && existing) {
      updateCustomerProfile(existing.id, payload);
      toast({ title: "Client updated", description: `${values.name} has been saved.` });
      navigate(`/clients/${existing.id}`);
    } else {
      const created = createCustomer(payload);
      toast({ title: "Client created", description: `${values.name} has been added.` });
      navigate(`/clients/${created.id}`);
    }
  };

  const stepNavigation = (
    <div className="flex items-center justify-between pt-6">
      <Button type="button" variant="outline" disabled={currentStepIndex === 0} onClick={() => moveStep(-1)}>
        Back
      </Button>
      {activeTab === "review" ? (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/clients")}>Cancel</Button>
          <Button type="submit">Save Client</Button>
        </div>
      ) : (
        <Button type="button" onClick={validateAndNext}>
          Next
        </Button>
      )}
    </div>
  );

  const creditLimitValue = Number(form.watch("creditLimit") ?? 0);
  const contractStartValue = form.watch("contractStart");
  const contractEndValue = form.watch("contractEnd");

  return (
    <AppLayout
      title={editing ? `Edit ${existing?.name}` : "Add Client"}
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Clients", to: "/clients" }, { label: editing ? "Edit" : "New" }]}
    >
      <PageSection>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof steps[number]["id"]) }>
            <TabsList textColor="primary" indicatorColor="primary">
              {steps.map((step) => (
                <TabsTrigger key={step.id} value={step.id}>{step.label}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as CustomerStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select value={form.watch("size")} onValueChange={(value) => form.setValue("size", value as CustomerSize)}>
                    <SelectTrigger id="size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration No.</Label>
                  <Input id="registrationNumber" {...form.register("registrationNumber")} />
                  {form.formState.errors.registrationNumber && <p className="text-xs text-destructive">{form.formState.errors.registrationNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input id="taxId" {...form.register("taxId")} />
                </div>
              </div>
              {stepNavigation}
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input id="creditLimit" type="number" min="0" step="100" {...form.register("creditLimit", { valueAsNumber: true })} />
                  {form.formState.errors.creditLimit && <p className="text-xs text-destructive">{form.formState.errors.creditLimit.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Recurring Invoices</Label>
                  <Controller
                    control={form.control}
                    name="recurringInvoices"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="recurringInvoices" />
                        <span className="text-sm text-muted-foreground">Automatically generate invoices</span>
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractStart">Contract Start</Label>
                  <Input id="contractStart" type="date" {...form.register("contractStart")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractEnd">Contract End</Label>
                  <Input id="contractEnd" type="date" {...form.register("contractEnd")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Input id="paymentTerms" placeholder="Net 30" {...form.register("paymentTerms")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" rows={3} placeholder="Internal notes (optional)" {...form.register("notes")} />
                </div>
              </div>
              {stepNavigation}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryContactName">Primary Contact Name</Label>
                  <Input id="primaryContactName" {...form.register("primaryContactName")} />
                  {form.formState.errors.primaryContactName && <p className="text-xs text-destructive">{form.formState.errors.primaryContactName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactRole">Primary Contact Role</Label>
                  <Input id="primaryContactRole" {...form.register("primaryContactRole")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactEmail">Primary Contact Email</Label>
                  <Input id="primaryContactEmail" type="email" {...form.register("primaryContactEmail")} />
                  {form.formState.errors.primaryContactEmail && <p className="text-xs text-destructive">{form.formState.errors.primaryContactEmail.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactPhone">Primary Contact Phone</Label>
                  <Input id="primaryContactPhone" {...form.register("primaryContactPhone")} />
                  {form.formState.errors.primaryContactPhone && <p className="text-xs text-destructive">{form.formState.errors.primaryContactPhone.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Additional Contacts</Label>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
                        <Input placeholder="Name" {...form.register(`additionalContacts.${index}.name` as const)} />
                        <Input placeholder="Role" {...form.register(`additionalContacts.${index}.role` as const)} />
                        <Input placeholder="Email" type="email" {...form.register(`additionalContacts.${index}.email` as const)} />
                        <div className="flex items-center gap-2">
                          <Input placeholder="Phone" {...form.register(`additionalContacts.${index}.phone` as const)} />
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={() => append({ name: "", role: "", email: "", phone: "" })}>
                      <Plus className="h-4 w-4" /> Add contact
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" {...form.register("street")} />
                  {form.formState.errors.street && <p className="text-xs text-destructive">{form.formState.errors.street.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("city")} />
                  {form.formState.errors.city && <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...form.register("state")} />
                  {form.formState.errors.state && <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" {...form.register("postalCode")} />
                  {form.formState.errors.postalCode && <p className="text-xs text-destructive">{form.formState.errors.postalCode.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...form.register("country")} />
                  {form.formState.errors.country && <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>}
                </div>
              </div>
              {stepNavigation}
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Business Info</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>{form.watch("status")}</dd>
                    <dt className="text-muted-foreground">Name</dt>
                    <dd>{form.watch("name")}</dd>
                    <dt className="text-muted-foreground">Size</dt>
                    <dd>{form.watch("size")}</dd>
                    <dt className="text-muted-foreground">Registration No.</dt>
                    <dd>{form.watch("registrationNumber")}</dd>
                    <dt className="text-muted-foreground">Tax ID</dt>
                    <dd>{form.watch("taxId") || "—"}</dd>
                  </dl>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Financial</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Credit Limit</dt>
                    <dd>{formatCurrency(creditLimitValue)}</dd>
                    <dt className="text-muted-foreground">Recurring</dt>
                    <dd>{form.watch("recurringInvoices") ? "Enabled" : "Disabled"}</dd>
                    <dt className="text-muted-foreground">Contract</dt>
                    <dd>{contractStartValue ? `${contractStartValue} ? ${contractEndValue || "Open"}` : "—"}</dd>
                    <dt className="text-muted-foreground">Payment Terms</dt>
                    <dd>{form.watch("paymentTerms") || "—"}</dd>
                  </dl>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Primary Contact</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd>{form.watch("primaryContactName")}</dd>
                    <dt className="text-muted-foreground">Role</dt>
                    <dd>{form.watch("primaryContactRole") || "—"}</dd>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{form.watch("primaryContactEmail")}</dd>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>{form.watch("primaryContactPhone")}</dd>
                  </dl>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Address</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Street</dt>
                    <dd>{form.watch("street")}</dd>
                    <dt className="text-muted-foreground">City</dt>
                    <dd>{form.watch("city")}</dd>
                    <dt className="text-muted-foreground">State</dt>
                    <dd>{form.watch("state")}</dd>
                    <dt className="text-muted-foreground">Postal Code</dt>
                    <dd>{form.watch("postalCode")}</dd>
                    <dt className="text-muted-foreground">Country</dt>
                    <dd>{form.watch("country")}</dd>
                  </dl>
                </div>
              </div>
              {stepNavigation}
            </TabsContent>
          </Tabs>
        </form>
      </PageSection>
    </AppLayout>
  );
}
