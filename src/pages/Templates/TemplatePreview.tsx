import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/settings";

export default function TemplatePreview() {
  return (
    <AppLayout
      title="Template Preview"
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Templates" }, { label: "Preview" }]}
      actions={<Button>Send Test Email</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PageSection title="Default Invoice Template">
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
          </div>
        </PageSection>
        <PageSection title="Branding Tips">
          Use Settings → Branding to update your logo and primary color. Templates can support multiple themes later.
        </PageSection>
      </div>
    </AppLayout>
  );
}



