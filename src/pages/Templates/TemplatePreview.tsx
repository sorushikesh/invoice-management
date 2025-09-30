import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/settings";

export default function TemplatePreview() {
  return (
    <AppLayout title="Template Preview">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Default Invoice Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              <div className="mb-4 text-xl font-semibold">Company Name</div>
              <div className="mb-6">Invoice #: INV-1001 • Date: 2025-09-30</div>
              <div className="mb-2 font-medium">Bill To</div>
              <div className="mb-6">Acme Corp • billing@acme.com</div>
              <div className="mb-2 font-medium">Items</div>
              <div className="mb-2">Consulting Hours — 10 × {formatCurrency(80)}</div>
              <div className="mb-6">Website Design — 1 × {formatCurrency(2500)}</div>
              <div className="text-right text-base font-semibold">Total: {formatCurrency(3300)}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline">Download PDF</Button>
              <Button>Send Test Email</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Branding Tips</CardTitle>
          </CardHeader>
          <CardContent>
            Use Settings → Branding to update your logo and primary color. Templates can support multiple themes later.
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
