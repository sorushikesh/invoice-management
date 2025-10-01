import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Upload, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { getCustomers, createInvoice } from "@/services/data";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/settings";

type LineItem = {
  id: string;
  kind: "Services" | "Deposit" | "Items";
  product: string;
  notes: string;
  quantity: number;
  unitPrice: number;
};

export default function NewInvoice() {
  const navigate = useNavigate();
  const customers = useMemo(() => getCustomers(), []);
  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || "");
  const [date, setDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [currency, setCurrency] = useState("USD");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", kind: "Services", product: "Hosting (month)", notes: "", quantity: 1, unitPrice: 25 },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const customerName = useMemo(() => customers.find((c) => c.id === customerId)?.name || "New invoice", [customerId, customers]);
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [taxType, setTaxType] = useState("Percentage");
  const [taxValue, setTaxValue] = useState(0);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<{ customer?: string; date?: string; due?: string }>({});

  // Prefill sensible defaults: today and +30 days
  useEffect(() => {
    if (!date) setDate(new Date());
    if (!dueDate) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setDueDate(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn before accidental tab/browser close if unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave("Draft");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave("Sent");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), kind: "Items", product: "", notes: "", quantity: 1, unitPrice: 0 },
    ]);
    setDirty(true);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
    setDirty(true);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setDirty(true);
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = discountType === "Percentage" ? (subtotal * discountValue) / 100 : discountValue;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxType === "Percentage" ? (taxableAmount * taxValue) / 100 : taxValue;
  const total = taxableAmount + taxAmount;

  const dueInDays = useMemo(() => {
    if (!date || !dueDate) return undefined;
    const diffMs = dueDate.getTime() - date.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, [date, dueDate]);

  const handleSave = (status: "Draft" | "Sent" = "Draft") => {
    const nextErrors: typeof errors = {};
    if (!customerId) nextErrors.customer = "Please choose a client";
    if (!date) nextErrors.date = "Select a date";
    if (!dueDate) nextErrors.due = "Select a due date";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast({ title: "Missing information", description: "Please complete required fields.", variant: "destructive" });
      return;
    }
    try {
      const inv = createInvoice({
        number: invoiceNumber,
        customerId,
        date: format(date, "yyyy-MM-dd"),
        due: format(dueDate, "yyyy-MM-dd"),
        amount: total,
        status,
        subject,
        po: poNumber,
        taxNumber,
        currency,
      });
      toast({ title: "Invoice created", description: `#${inv.number} for ${inv.customerName}` });
      setDirty(false);
      navigate(`/invoices/${inv.number}`);
    } catch (e) {
      toast({ title: "Could not create invoice", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    }
  };

  return (
    <AppLayout
      title={`New invoice for ${customerName}`}
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Invoices", to: "/invoices" }, { label: "New" }]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave("Draft")}>Save Draft</Button>
        </div>
      }
    >
      <PageSection className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Primary Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Invoice number</Label>
                <Input value={invoiceNumber} onChange={(e) => { setInvoiceNumber(e.target.value); setDirty(true); }} placeholder="Auto" />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={customerId} onValueChange={(v) => { setCustomerId(v); setDirty(true); setErrors((e) => ({ ...e, customer: undefined })); const tax = customers.find(c => c.id === v)?.taxId || ""; setTaxNumber(tax); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customer && <p className="text-xs text-destructive">{errors.customer}</p>}
              </div>
              <div className="space-y-2">
                <Label>PO number</Label>
                <Input value={poNumber} onChange={(e) => { setPoNumber(e.target.value); setDirty(true); }} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Tax number</Label>
                <Input value={taxNumber} onChange={(e) => { setTaxNumber(e.target.value); setDirty(true); }} placeholder="Customer tax ID" />
              </div>
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => { setSubject(e.target.value); setDirty(true); }} placeholder="What is this invoice for?" />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd-MM-yyyy") : <span>dd-mm-yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => { setDate(d); setDirty(true); setErrors((e) => ({ ...e, date: undefined })); }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label>Due date</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select onValueChange={(v) => {
                    const base = date || new Date();
                    let d = new Date(base);
                    const map: Record<string, number> = { receipt: 0, d7: 7, d14: 14, d30: 30, d45: 45, d60: 60 };
                    if (v in map) {
                      d.setDate(d.getDate() + map[v]);
                      setDueDate(d);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">Due on receipt</SelectItem>
                      <SelectItem value="d7">7 days</SelectItem>
                      <SelectItem value="d14">14 days</SelectItem>
                      <SelectItem value="d30">30 days</SelectItem>
                      <SelectItem value="d45">45 days</SelectItem>
                      <SelectItem value="d60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "dd-MM-yyyy") : <span>dd-mm-yyyy</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(d) => { setDueDate(d); setDirty(true); setErrors((e) => ({ ...e, due: undefined })); }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {dueInDays !== undefined && (dueInDays >= 0 ? `Due in ${dueInDays} day${dueInDays === 1 ? "" : "s"}` : `${Math.abs(dueInDays)} day${Math.abs(dueInDays) === 1 ? "" : "s"} overdue`)}
                </div>
                {errors.due && <p className="text-xs text-destructive">{errors.due}</p>}
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={(v) => { setCurrency(v); setDirty(true); }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Totals displayed in {currency}</p>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <Label className="text-base">Line Items</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-table-header px-4 py-3 grid grid-cols-12 gap-4 text-xs font-semibold uppercase">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Qty.</div>
                  <div className="col-span-2">Unit</div>
                  <div className="col-span-1 text-right">Value</div>
                  <div className="col-span-1"></div>
                </div>

                {lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "px-4 py-3 grid grid-cols-12 gap-4 items-center border-t",
                      index % 2 === 0 && "bg-muted/20"
                    )}
                  >
                    <div className="col-span-2">
                      <Select value={item.kind} onValueChange={(v) => updateLineItem(item.id, "kind", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="Deposit">Deposit</SelectItem>
                          <SelectItem value="Items">Items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">
                      <Input
                        placeholder="Hosting (month)"
                        value={item.product}
                        onChange={(e) => updateLineItem(item.id, "product", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateLineItem(item.id, "quantity", Math.max(1, (item.quantity || 1) - 1))}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                        />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateLineItem(item.id, "quantity", Math.max(1, (item.quantity || 1) + 1))}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          className="pr-14"
                          onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground">{currency}</span>
                      </div>
                    </div>
                    <div className="col-span-1 text-right font-medium tabular-nums">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {lineItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={addLineItem} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </div>

            {/* Invoice Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Invoice Notes</Label>
              <Textarea
                id="notes"
                placeholder="Notes visible on the invoice (optional)"
                rows={4}
                value={invoiceNotes}
                onChange={(e) => { setInvoiceNotes(e.target.value); setDirty(true); }}
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <label className="block border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop files here or click to browse</p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) {
                      setAttachments((prev) => [...prev, ...files]);
                      setDirty(true);
                    }
                  }}
                />
              </label>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((f, idx) => (
                    <div key={`${f.name}-${idx}`} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                      <span className="max-w-[180px] truncate" title={f.name}>{f.name}</span>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate("/invoices")}>Cancel</Button>
              <Button size="lg" className="px-8" onClick={() => handleSave("Sent")}>Save invoice</Button>
            </div>
          </div>

          {/* Totals Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-24 rounded-lg border bg-card p-4 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-semibold tabular-nums">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Discount</span>
                  <Select value={discountType} onValueChange={(v) => { setDiscountType(v); setDirty(true); }}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => { setDiscountValue(parseFloat(e.target.value) || 0); setDirty(true); }}
                    className="w-24 h-8"
                    onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  />
                  <span className="text-sm">-{formatCurrency(discountAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tax</span>
                  <Select value={taxType} onValueChange={(v) => { setTaxType(v); setDirty(true); }}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={taxValue}
                    onChange={(e) => { setTaxValue(parseFloat(e.target.value) || 0); setDirty(true); }}
                    className="w-24 h-8"
                    onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  />
                  <span className="text-sm">+{formatCurrency(taxAmount)}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-bold tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </AppLayout>
  );
}


