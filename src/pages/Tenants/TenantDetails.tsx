import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import RHFTextField from "@/material/components/RHFTextField";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RequireRole } from "@/components/auth/RequireRole";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function TenantDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    name: z.string().min(2, "Name is required"),
    currency: z.string().min(3, "3-letter code").max(3, "3-letter code"),
    timeZone: z.string().min(1, "Time zone is required"),
    brandColor: z.string().min(1),
  });
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: id || "", currency: "USD", timeZone: "UTC", brandColor: "#4f46e5" },
  });

  const onSave = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      // TODO: apiFetch(`/tenants/${id}`, { method: 'PUT', body: { ...data, currency: data.currency.toUpperCase() } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Tenant updated", description: `${data.name} settings saved.` });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete tenant? This action cannot be undone.")) return;
    setLoading(true);
    try {
      // TODO: apiFetch(`/tenants/${id}`, { method: 'DELETE' })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Tenant deleted" });
      nav("/tenants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireRole role="TenantAdmin">
      <AppLayout
        title="Tenant Details"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Tenants", to: "/tenants" }, { label: String(id) } ]}
        actions={<Button  type="submit" form="tenant-edit" disabled={loading}>Save</Button>}
      >
        <div className="mx-auto max-w-xl">
          <PageSection title="Edit Tenant">
              <form id="tenant-edit" onSubmit={handleSubmit(onSave)} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <RHFTextField name="name" control={control} label="Name" disabled={loading} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField name={field.name} control={control} label="Currency" disabled={loading} {...field} onChange={(e: any) => setValue("currency", String(e.target.value).toUpperCase())} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tz">Time Zone</Label>
                    <RHFTextField name="timeZone" control={control} label="Time Zone" disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand Color</Label>
                    <RHFTextField name="brandColor" control={control} label="Brand Color" type="color" disabled={loading} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="destructive" onClick={onDelete} disabled={loading}>Delete</Button>
                </div>
              </form>
          </PageSection>
        </div>
      </AppLayout>
    </RequireRole>
  );
}


