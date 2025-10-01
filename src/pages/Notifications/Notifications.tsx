import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import ActionButton from "@/components/ActionButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Notifications() {
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    beforeDueDays: z.coerce.number().min(0, "Must be 0 or more"),
    afterDueDays: z.coerce.number().min(0, "Must be 0 or more"),
    invoiceEmail: z.string().min(1, "Required"),
    reminderEmail: z.string().min(1, "Required"),
    paymentEmail: z.string().min(1, "Required"),
  });
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      beforeDueDays: 3,
      afterDueDays: 1,
      invoiceEmail: "Hi {{customer.name}}, your invoice {{invoice.number}} is attached.",
      reminderEmail: "Reminder: Invoice {{invoice.number}} is due on {{invoice.dueDate}}.",
      paymentEmail: "Payment received for {{invoice.number}}. Thank you!",
    },
  });

  const onSave = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      // TODO: apiFetch('/notifications/settings', { method: 'PUT', body: data })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Notification settings saved" });
      reset(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Notifications"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Notifications" }]}
      actions={<ActionButton type="submit" form="noti-form" disabled={loading}>Save</ActionButton>}
    >
      <form id="noti-form" onSubmit={handleSubmit(onSave)} className="grid gap-6">
        <PageSection title="Reminder Schedule">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="before">Days Before Due</Label>
              <Input id="before" type="number" min="0" disabled={loading} {...register("beforeDueDays", { valueAsNumber: true })} />
              {errors.beforeDueDays && <p className="text-xs text-destructive">{errors.beforeDueDays.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="after">Days After Due</Label>
              <Input id="after" type="number" min="0" disabled={loading} {...register("afterDueDays", { valueAsNumber: true })} />
              {errors.afterDueDays && <p className="text-xs text-destructive">{errors.afterDueDays.message}</p>}
            </div>
          </div>
        </PageSection>

        <PageSection title="Email Templates">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Invoice Sent</Label>
              <Textarea rows={3} disabled={loading} {...register("invoiceEmail")} />
              {errors.invoiceEmail && <p className="text-xs text-destructive">{errors.invoiceEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Due Reminder</Label>
              <Textarea rows={3} disabled={loading} {...register("reminderEmail")} />
              {errors.reminderEmail && <p className="text-xs text-destructive">{errors.reminderEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Payment Received</Label>
              <Textarea rows={3} disabled={loading} {...register("paymentEmail")} />
              {errors.paymentEmail && <p className="text-xs text-destructive">{errors.paymentEmail.message}</p>}
            </div>
          </div>
        </PageSection>

        <div>
          <Button type="submit" disabled={loading}>Save</Button>
        </div>
      </form>
    </AppLayout>
  );
}


