import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function PaymentCreate() {
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice || !date || !method || !amount) {
      toast({ title: "Missing fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // TODO: apiFetch('/payments', { method: 'POST', body: { invoice, date, method, amount: Number(amount) } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Payment recorded", description: `Payment of $${amount} for ${invoice}.` });
      setInvoice("");
      setDate("");
      setMethod("");
      setAmount("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Record Payment">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice">Invoice Number</Label>
                <Input id="invoice" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder="INV-1001" disabled={loading} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="method">Method</Label>
                  <Input id="method" value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Card, Bank, Cash..." disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" disabled={loading} />
              </div>
              <Button type="submit" disabled={loading}>Save</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

