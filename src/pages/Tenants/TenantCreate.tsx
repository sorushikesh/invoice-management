import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import RHFTextField from "@/material/components/RHFTextField";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RequireRole } from "@/components/auth/RequireRole";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function TenantCreate() {
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    name: z.string().min(2, "Name is required"),
    currency: z.string().min(3, "3-letter code").max(3, "3-letter code"),
    timeZone: z.string().min(1, "Time zone is required"),
    brandColor: z.string().min(1),
    adminEmail: z.string().email("Enter a valid email"),
  });
  const { register, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", currency: "USD", timeZone: "UTC", brandColor: "#4f46e5", adminEmail: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      // TODO: apiFetch('/tenants', { method: 'POST', body: { ...data, currency: data.currency.toUpperCase() } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Tenant created", description: `${data.name} onboarded with admin ${data.adminEmail}` });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireRole role="TenantAdmin">
      <AppLayout
        title="Create Tenant"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Tenants", to: "/tenants" }, { label: "New" }]}
        actions={<Button  type="submit" form="tenant-form" disabled={loading}>Save Tenant</Button>}
      >
        <div className="mx-auto max-w-xl">
          <PageSection title="New Tenant">
              <form id="tenant-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
                      render={({ field, fieldState }) => (
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
                <div className="space-y-2">
                  <Label htmlFor="admin">Admin Email</Label>
                  <RHFTextField name="adminEmail" control={control} label="Admin Email" disabled={loading} />
                </div>
                <Button type="submit" disabled={loading}>Save Tenant</Button>
              </form>
          </PageSection>
        </div>
      </AppLayout>
    </RequireRole>
  );
}


