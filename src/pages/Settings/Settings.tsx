import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getSettings, saveSettings } from "@/lib/settings";

export default function Settings() {
  const initial = getSettings();
  const [company, setCompany] = useState("Acme Corp");
  const [email, setEmail] = useState("billing@acme.com");
  const [phone, setPhone] = useState("+1 555 000 0000");
  const [address, setAddress] = useState("123 Main St, City");

  const [logoUrl, setLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#4f46e5");
  const [currencyCode, setCurrencyCode] = useState(initial.currencyCode);
  const [locale, setLocale] = useState(initial.locale);

  const [invPrefix, setInvPrefix] = useState("INV-");
  const [invNext, setInvNext] = useState("1001");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [loading, setLoading] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Persist to backend
      await new Promise((r) => setTimeout(r, 600));
      saveSettings({ currencyCode, locale });
      toast({ title: "Settings saved", description: "Your preferences were updated." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <form onSubmit={onSave} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Billing Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Primary Color</Label>
              <Input id="color" type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Code</Label>
              <Input id="currency" value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())} placeholder="USD, INR, EUR..." disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input id="locale" value={locale} onChange={(e) => setLocale(e.target.value)} placeholder="en-US, en-IN..." disabled={loading} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Defaults</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="prefix">Invoice Prefix</Label>
              <Input id="prefix" value={invPrefix} onChange={(e) => setInvPrefix(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="next">Next Number</Label>
              <Input id="next" value={invNext} onChange={(e) => setInvNext(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="terms">Default Payment Terms</Label>
              <Input id="terms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} disabled={loading} />
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={loading}>Save Settings</Button>
        </div>
      </form>
    </AppLayout>
  );
}
