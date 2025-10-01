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

export default function PaymentCreate() {
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    invoice: z.string().min(1, "Invoice number is required"),
    date: z.string().min(1, "Date is required"),
    method: z.string().min(1, "Method is required"),
    txn: z.string().optional(),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
  });

  const { control, handleSubmit, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { invoice: "", date: "", method: "", txn: "", amount: 0 },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      // TODO: apiFetch('/payments', { method: 'POST', body: { invoice: data.invoice, date: data.date, method: data.method, transactionId: data.txn, amount: data.amount } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Payment recorded", description: `Payment of $${data.amount} for ${data.invoice}.` });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Record Payment"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Payments", to: "/payments" }, { label: "New" }]}
      actions={<ActionButton type="submit" form="payment-form" disabled={loading}>Save</ActionButton>}
    >
      <div className="mx-auto max-w-2xl">
        <PageSection title="New Payment">
            <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice">Invoice Number</Label>
                <RHFTextField name="invoice" control={control} label="Invoice Number" disabled={loading} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <RHFTextField name="date" control={control} label="Date" type="date" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <RHFTextField name="method" control={control} label="Method" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="txn">Transaction ID</Label>
                  <RHFTextField name="txn" control={control} label="Transaction ID" disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <RHFTextField name="amount" control={control} label="Amount" type="number" disabled={loading} />
              </div>
              <Button type="submit" disabled={loading}>Save</Button>
            </form>
        </PageSection>
      </div>
    </AppLayout>
  );
}


