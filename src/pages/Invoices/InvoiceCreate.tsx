import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/settings";

type Product = { id: string; name: string; price: number; unit: string };

const sampleProducts: Product[] = [
  { id: "p-001", name: "Consulting Hours", price: 80, unit: "hour" },
  { id: "p-002", name: "Website Design", price: 2500, unit: "project" },
  { id: "p-003", name: "Hosting", price: 25, unit: "month" },
];

export default function InvoiceCreate() {
  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [items, setItems] = useState<{ id: string; productId: string; qty: string; note: string }[]>([
    { id: crypto.randomUUID(), productId: "", qty: "1", note: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [taxMode, setTaxMode] = useState<"percent" | "amount">("percent");
  const [taxValue, setTaxValue] = useState<string>("0");
  const [invoiceNotes, setInvoiceNotes] = useState<string>("");

  const products = useMemo(() => sampleProducts, []);
  const lineTotals = items.map((it) => {
    const prod = products.find((p) => p.id === it.productId);
    const unit = prod?.price ?? 0;
    const q = Math.max(0, Number(it.qty) || 0);
    return { unit, qty: q, total: unit * q };
  });
  const subtotal = lineTotals.reduce((sum, lt) => sum + lt.total, 0);
  const discountPercent = Math.max(0, Math.min(100, Number(discountValue) || 0));
  const rawDiscountAmount = Math.max(0, Number(discountValue) || 0);
  const discountAmount = discountMode === "percent" ? (subtotal * discountPercent) / 100 : Math.min(subtotal, rawDiscountAmount);
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxPercent = Math.max(0, Math.min(100, Number(taxValue) || 0));
  const rawTaxAmount = Math.max(0, Number(taxValue) || 0);
  const taxAmount = taxMode === "percent" ? (taxable * taxPercent) / 100 : rawTaxAmount;
  const grandTotal = taxable + taxAmount;

  const updateItem = (id: string, patch: Partial<{ productId: string; qty: string; note: string }>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const addItem = () => setItems((prev) => [...prev, { id: crypto.randomUUID(), productId: "", qty: "1", note: "" }]);
  const removeItem = (id: string) => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasValidLine = items.some((it) => (products.find((p) => p.id === it.productId) && (Number(it.qty) || 0) > 0));
    if (!client || !date || !due || !hasValidLine) {
      toast({ title: "Missing fields", description: "Client, dates, and at least one valid line item are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const detailed = items
        .map((it) => {
          const prod = products.find((p) => p.id === it.productId);
          const q = Math.max(0, Number(it.qty) || 0);
          return prod && q > 0
            ? { productId: prod.id, name: prod.name, unit: prod.unit, qty: q, unitPrice: prod.price, lineTotal: prod.price * q, note: it.note }
            : null;
        })
        .filter(Boolean) as Array<{ productId: string; name: string; unit: string; qty: number; unitPrice: number; lineTotal: number; note?: string }>;
      const payload = {
        client,
        date,
        due,
        items: detailed,
        subtotal,
        discountMode,
        discountValue: discountValue,
        discountAmount,
        taxMode,
        taxValue: taxValue,
        taxAmount,
        total: grandTotal,
        notes: invoiceNotes,
      };
      // TODO: apiFetch('/invoices', { method: 'POST', body: payload })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Invoice created", description: `Invoice for ${client} with ${detailed.length} line item(s) saved.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Create Invoice">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Invoice</CardTitle>
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
                  <Label htmlFor="due">Due Date</Label>
                  <Input id="due" type="date" value={due} onChange={(e) => setDue(e.target.value)} disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Line Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product/Service</TableHead>
                      <TableHead className="min-w-40">Notes</TableHead>
                      <TableHead className="w-28">Qty</TableHead>
                      <TableHead className="w-36 text-right">Unit Price</TableHead>
                      <TableHead className="w-36 text-right">Line Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => (
                      <TableRow key={it.id}>
                        <TableCell>
                          <Select value={it.productId} onValueChange={(val) => updateItem(it.id, { productId: val })}>
                            <SelectTrigger disabled={loading}>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} ({p.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Optional line note"
                            value={it.note}
                            onChange={(e) => updateItem(it.id, { note: e.target.value })}
                            disabled={loading}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={it.qty}
                            onChange={(e) => updateItem(it.id, { qty: e.target.value })}
                            disabled={loading || !it.productId}
                          />
                        </TableCell>
                        <TableCell className="text-right align-middle">{formatCurrency(lineTotals[idx].unit)}</TableCell>
                        <TableCell className="text-right align-middle font-medium">{formatCurrency(lineTotals[idx].total)}</TableCell>
                        <TableCell className="text-right">
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(it.id)} disabled={items.length === 1}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Button type="button" variant="outline" onClick={addItem} className="mt-2">
                          <Plus className="mr-2 h-4 w-4" /> Add Line
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex justify-end pt-2">
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm gap-2">
                      <div className="flex items-center gap-2">
                        <span>Discount</span>
                        <Select value={discountMode} onValueChange={(v) => setDiscountMode(v as any)}>
                          <SelectTrigger className="h-8 w-28" disabled={loading}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">Percent (%)</SelectItem>
                            <SelectItem value="amount">Amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          className="h-8 w-24"
                          type="number"
                          min="0"
                          max={discountMode === 'percent' ? 100 : undefined}
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <span>- {formatCurrency(discountAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm gap-2">
                      <div className="flex items-center gap-2">
                        <span>Tax</span>
                        <Select value={taxMode} onValueChange={(v) => setTaxMode(v as any)}>
                          <SelectTrigger className="h-8 w-28" disabled={loading}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">Percent (%)</SelectItem>
                            <SelectItem value="amount">Amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          className="h-8 w-24"
                          type="number"
                          min="0"
                          max={taxMode === 'percent' ? 100 : undefined}
                          value={taxValue}
                          onChange={(e) => setTaxValue(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <span>+ {formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-base font-semibold">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Invoice Notes</Label>
                <Textarea rows={3} placeholder="Notes visible on the invoice (optional)" value={invoiceNotes} onChange={(e) => setInvoiceNotes(e.target.value)} disabled={loading} />
              </div>

              <Button type="submit" disabled={loading}>Save Invoice</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
