import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import RHFTextField from "@/material/components/RHFTextField";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProductCreate() {
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    name: z.string().min(2, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    unit: z.string().min(1, "Unit is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
  });
  const { control, handleSubmit, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", sku: "", unit: "", price: 0 },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      // TODO: apiFetch('/products', { method: 'POST', body: { ...data } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Saved", description: `${data.name} added to catalog.` });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Add Product/Service"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Products", to: "/products" }, { label: "New" }]}
      actions={<ActionButton type="submit" form="product-form" disabled={loading}>Save</ActionButton>}
    >
      <div className="mx-auto max-w-2xl">
        <PageSection title="New Catalog Item">
            <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <RHFTextField name="name" control={control} label="Name" disabled={loading} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <RHFTextField name="sku" control={control} label="SKU" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <RHFTextField name="unit" control={control} label="Unit" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <RHFTextField name="price" control={control} label="Price" type="number" disabled={loading} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>Save</Button>
            </form>
        </PageSection>
      </div>
    </AppLayout>
  );
}


