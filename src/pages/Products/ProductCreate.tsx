import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ProductCreate() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !unit || !price) {
      toast({ title: "Missing fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // TODO: apiFetch('/products', { method: 'POST', body: { name, sku, unit, price: Number(price) } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Saved", description: `${name} added to catalog.` });
      setName("");
      setSku("");
      setUnit("");
      setPrice("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Add Product/Service">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Catalog Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Service or product name" disabled={loading} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="hour, item, project..." disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" disabled={loading} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>Save</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

