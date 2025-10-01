import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import ActionButton from "@/components/ActionButton";
import RHFTextField from "@/material/components/RHFTextField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EstimateCreate() {
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    client: z.string().min(1, "Client is required"),
    date: z.string().min(1, "Date is required"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
  });
  const { control, handleSubmit, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { client: "", date: "", amount: 0 },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      // TODO: apiFetch('/estimates', { method: 'POST', body: data })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Estimate created", description: `Estimate for ${data.client} saved.` });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Create Estimate"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Estimates", to: "/estimates" }, { label: "New" }]}
      actions={<ActionButton type="submit" form="est-form" disabled={loading}>Save Estimate</ActionButton>}
    >
      <div className="mx-auto max-w-2xl">
        <PageSection title="New Estimate">
            <form id="est-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <RHFTextField name="client" control={control} label="Client" disabled={loading} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <RHFTextField name="date" control={control} label="Date" type="date" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <RHFTextField name="amount" control={control} label="Amount" type="number" disabled={loading} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>Save Estimate</Button>
            </form>
        </PageSection>
      </div>
    </AppLayout>
  );
}


