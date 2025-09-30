import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function EstimateCreate() {
  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !date || !amount) {
      toast({ title: "Missing fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // TODO: apiFetch('/estimates', { method: 'POST', body: { client, date, amount: Number(amount) } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Estimate created", description: `Estimate for ${client} saved.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Create Estimate">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Acme Corp" disabled={loading} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" disabled={loading} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>Save Estimate</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

