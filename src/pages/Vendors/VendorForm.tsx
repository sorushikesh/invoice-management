import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import Rating from "@mui/material/Rating";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { toast } from "@/hooks/use-toast";
import { createVendor, getVendorById, updateVendorProfile, VendorStatus, BusinessCategory } from "@/services/data";

const categories: BusinessCategory[] = ["Manufacturer", "Distributor", "Service Provider"];
const paymentTermsOptions = ["Net 15", "Net 30", "Net 60", "COD"];
const statusOptions: VendorStatus[] = ["Active", "Inactive"];
const countryOptions = ["United States", "Canada", "United Kingdom", "Australia", "India", "Singapore", "Germany", "France", "Brazil", "Mexico"];
const phoneCodes = [
  { code: "+1", label: "United States" },
  { code: "+44", label: "United Kingdom" },
  { code: "+61", label: "Australia" },
  { code: "+91", label: "India" },
  { code: "+65", label: "Singapore" },
  { code: "+49", label: "Germany" },
];

const schema = z.object({
  status: z.enum(["Active", "Inactive"]).default("Active"),
  name: z.string().min(2, "Name is required"),
  businessCategory: z.enum(["Manufacturer", "Distributor", "Service Provider"]),
  registrationNumber: z.string().min(1, "Registration number required"),
  rating: z.number().min(0).max(5),
  contactName: z.string().min(2, "Primary contact required"),
  email: z.string().email("Enter a valid email"),
  phoneCode: z.string().min(1, "Code"),
  phoneNumber: z.string().min(4, "Phone number required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  street: z.string().min(2, "Street address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  postalCode: z.string().min(2, "Postal code required"),
  country: z.string().min(2, "Country required"),
  paymentTerms: z.enum(["Net 15", "Net 30", "Net 60", "COD"]),
  bankAccountNumber: z.string().min(4, "Account number required"),
  bankName: z.string().min(2, "Bank name required"),
  bankSwift: z.string().min(2, "IFSC / SWIFT required"),
  taxId: z.string().min(2, "Tax ID required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const stepOrder: Array<{ id: string; label: string }> = [
  { id: "business", label: "Business Info" },
  { id: "contact", label: "Contact Details" },
  { id: "address", label: "Address" },
  { id: "financial", label: "Financial Details" },
  { id: "review", label: "Review & Save" },
];

export default function VendorForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editing = Boolean(id);
  const existing = useMemo(() => (id ? getVendorById(id) : undefined), [id]);

  const defaultCode = useMemo(() => {
    if (!existing?.phone) return phoneCodes[0].code;
    const match = existing.phone.match(/^\+(\d{1,3})/);
    const code = match ? `+${match[1]}` : phoneCodes[0].code;
    return phoneCodes.find((c) => c.code === code)?.code || phoneCodes[0].code;
  }, [existing?.phone]);

  const defaultNumber = useMemo(() => {
    if (!existing?.phone) return "";
    return existing.phone.replace(/^\+\d{1,3}\s*/, "");
  }, [existing?.phone]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: existing?.status || "Active",
      name: existing?.name || "",
      businessCategory: existing?.businessCategory || "Manufacturer",
      registrationNumber: existing?.registrationNumber || "",
      rating: existing?.rating || 0,
      contactName: existing?.contactName || "",
      email: existing?.email || "",
      phoneCode: defaultCode,
      phoneNumber: defaultNumber,
      website: existing?.website || "",
      street: existing?.addressLine1 || "",
      city: existing?.city || "",
      state: existing?.state || "",
      postalCode: existing?.postalCode || "",
      country: existing?.country || "United States",
      paymentTerms: (existing?.paymentTerms as FormValues["paymentTerms"]) || "Net 30",
      bankAccountNumber: existing?.bankAccountNumber || "",
      bankName: existing?.bankName || "",
      bankSwift: existing?.bankSwift || "",
      taxId: existing?.taxId || "",
      notes: "",
    },
  });

  const [activeTab, setActiveTab] = useState(stepOrder[0].id);

  if (editing && !existing) {
    return (
      <AppLayout title="Vendor not found" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Vendors", to: "/vendors" }]}>
        <PageSection title="Missing vendor">The vendor you are trying to edit could not be located.</PageSection>
      </AppLayout>
    );
  }

  const currentIndex = stepOrder.findIndex((step) => step.id === activeTab);

  const goToStep = (delta: number) => {
    const nextIndex = Math.min(Math.max(0, currentIndex + delta), stepOrder.length - 1);
    setActiveTab(stepOrder[nextIndex].id);
  };

  const triggerAndNext = async () => {
    const fieldsByStep: Record<string, Array<keyof FormValues>> = {
      business: ["status", "name", "businessCategory", "registrationNumber", "rating"],
      contact: ["contactName", "email", "phoneCode", "phoneNumber", "website"],
      address: ["street", "city", "state", "postalCode", "country"],
      financial: ["paymentTerms", "bankAccountNumber", "bankName", "bankSwift", "taxId"],
      review: [],
    } as const;
    const valid = await form.trigger(fieldsByStep[activeTab] || []);
    if (valid) goToStep(1);
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      status: values.status,
      name: values.name,
      businessCategory: values.businessCategory,
      registrationNumber: values.registrationNumber,
      rating: values.rating,
      contactName: values.contactName,
      email: values.email,
      phone: `${values.phoneCode} ${values.phoneNumber}`.trim(),
      website: values.website || undefined,
      addressLine1: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      paymentTerms: values.paymentTerms,
      bankAccountNumber: values.bankAccountNumber,
      bankName: values.bankName,
      bankSwift: values.bankSwift,
      taxId: values.taxId,
    };

    if (editing && existing) {
      updateVendorProfile(existing.id, payload);
      toast({ title: "Vendor updated" });
      navigate(`/vendors/${existing.id}`);
    } else {
      const created = createVendor(payload);
      toast({ title: "Vendor created", description: `${created.name} is now available in your directory.` });
      navigate(`/vendors/${created.id}`);
    }
  };

  const stepButtons = (
    <div className="flex items-center justify-between pt-6">
      <Button type="button" variant="outline" disabled={currentIndex === 0} onClick={() => goToStep(-1)}>
        Back
      </Button>
      {activeTab === "review" ? (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/vendors")}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      ) : (
        <Button type="button" onClick={triggerAndNext}>
          Next
        </Button>
      )}
    </div>
  );

  return (
    <AppLayout
      title={editing ? `Edit ${existing?.name}` : "Add Vendor"}
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Vendors", to: "/vendors" }, { label: editing ? "Edit" : "New" }]}
    >
      <PageSection>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList textColor="primary" indicatorColor="primary">
              {stepOrder.map((step) => (
                <TabsTrigger key={step.id} value={step.id} label={step.label} />
              ))}
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.watch("status")} onValueChange={(val) => form.setValue("status", val as VendorStatus)}>
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
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input id="name" {...form.register("name")}/>
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessCategory">Business Category</Label>
                  <Select value={form.watch("businessCategory")} onValueChange={(val) => form.setValue("businessCategory", val as BusinessCategory)}>
                    <SelectTrigger id="businessCategory">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.businessCategory && <p className="text-xs text-destructive">{form.formState.errors.businessCategory.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration No.</Label>
                  <Input id="registrationNumber" {...form.register("registrationNumber")}/>
                  {form.formState.errors.registrationNumber && <p className="text-xs text-destructive">{form.formState.errors.registrationNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Controller
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <Rating
                        precision={0.5}
                        value={field.value}
                        onChange={(_, value) => field.onChange(value || 0)}
                      />
                    )}
                  />
                </div>
              </div>
              {stepButtons}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Primary Contact Person</Label>
                  <Input id="contactName" {...form.register("contactName")}/>
                  {form.formState.errors.contactName && <p className="text-xs text-destructive">{form.formState.errors.contactName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")}/>
                  {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="flex gap-2">
                    <Select value={form.watch("phoneCode")} onValueChange={(val) => form.setValue("phoneCode", val)}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {phoneCodes.map((code) => (
                          <SelectItem key={code.code} value={code.code}>{code.code} ({code.label})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input {...form.register("phoneNumber")} placeholder="555 123 4567" />
                  </div>
                  {form.formState.errors.phoneNumber && <p className="text-xs text-destructive">{form.formState.errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://" {...form.register("website")}/>
                  {form.formState.errors.website && <p className="text-xs text-destructive">{form.formState.errors.website.message}</p>}
                </div>
              </div>
              {stepButtons}
            </TabsContent>

            <TabsContent value="address" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" {...form.register("street")}/>
                  {form.formState.errors.street && <p className="text-xs text-destructive">{form.formState.errors.street.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("city")}/>
                  {form.formState.errors.city && <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...form.register("state")}/>
                  {form.formState.errors.state && <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" {...form.register("postalCode")}/>
                  {form.formState.errors.postalCode && <p className="text-xs text-destructive">{form.formState.errors.postalCode.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Controller
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <Autocomplete
                        options={countryOptions}
                        value={field.value}
                        onChange={(_, value) => field.onChange(value || "")}
                        renderInput={(params) => <TextField {...params} label="Country" />}
                      />
                    )}
                  />
                  {form.formState.errors.country && <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>}
                </div>
              </div>
              {stepButtons}
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select value={form.watch("paymentTerms")} onValueChange={(val) => form.setValue("paymentTerms", val as FormValues["paymentTerms"])}>
                    <SelectTrigger id="paymentTerms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTermsOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentTerms && <p className="text-xs text-destructive">{form.formState.errors.paymentTerms.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID (GST/VAT)</Label>
                  <Input id="taxId" {...form.register("taxId")}/>
                  {form.formState.errors.taxId && <p className="text-xs text-destructive">{form.formState.errors.taxId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                  <Input id="bankAccountNumber" {...form.register("bankAccountNumber")}/>
                  {form.formState.errors.bankAccountNumber && <p className="text-xs text-destructive">{form.formState.errors.bankAccountNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" {...form.register("bankName")}/>
                  {form.formState.errors.bankName && <p className="text-xs text-destructive">{form.formState.errors.bankName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankSwift">Bank IFSC / SWIFT</Label>
                  <Input id="bankSwift" {...form.register("bankSwift")}/>
                  {form.formState.errors.bankSwift && <p className="text-xs text-destructive">{form.formState.errors.bankSwift.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" rows={3} placeholder="Internal notes (optional)" {...form.register("notes")} />
                </div>
              </div>
              {stepButtons}
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
                    <dt className="text-muted-foreground">Category</dt>
                    <dd>{form.watch("businessCategory")}</dd>
                    <dt className="text-muted-foreground">Registration No.</dt>
                    <dd>{form.watch("registrationNumber")}</dd>
                    <dt className="text-muted-foreground">Rating</dt>
                    <dd>{form.watch("rating")} / 5</dd>
                  </dl>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Contact</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Contact</dt>
                    <dd>{form.watch("contactName")}</dd>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{form.watch("email")}</dd>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>{`${form.watch("phoneCode")} ${form.watch("phoneNumber")}`}</dd>
                    <dt className="text-muted-foreground">Website</dt>
                    <dd>{form.watch("website") || "—"}</dd>
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
                <div className="rounded-lg border bg-muted/40 p-4">
                  <h3 className="text-sm font-semibold mb-3">Financial</h3>
                  <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Payment Terms</dt>
                    <dd>{form.watch("paymentTerms")}</dd>
                    <dt className="text-muted-foreground">Tax ID</dt>
                    <dd>{form.watch("taxId")}</dd>
                    <dt className="text-muted-foreground">Bank Account</dt>
                    <dd>{form.watch("bankAccountNumber")}</dd>
                    <dt className="text-muted-foreground">Bank Name</dt>
                    <dd>{form.watch("bankName")}</dd>
                    <dt className="text-muted-foreground">IFSC / SWIFT</dt>
                    <dd>{form.watch("bankSwift")}</dd>
                  </dl>
                </div>
              </div>
              {stepButtons}
            </TabsContent>
          </Tabs>
        </form>
      </PageSection>
    </AppLayout>
  );
}


