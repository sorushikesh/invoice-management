import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";
import StatusBadge from "@/components/StatusBadge";
import { getInvoiceByNumber } from "@/services/data";

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = getInvoiceByNumber(id);
  const shareUrl = `${location.origin}/public/invoice/${invoice?.number ?? id}`; // Example public URL

  return (
    <AppLayout
      title={invoice ? `Invoice ${invoice.number}` : "Invoice"}
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Invoices", to: "/invoices" }, { label: String(id) }]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy Share Link</Button>
          {invoice && <Button variant="secondary" onClick={() => navigate(`/invoices/${invoice.number}/preview`)}>Preview PDF</Button>}
          <Button>Send</Button>
        </div>
      }
    >
      {!invoice ? (
        <div className="text-muted-foreground">Invoice not found.</div>
      ) : (
        <>
          <div className="mb-4 text-xl font-semibold">{invoice.customerName}</div>
          <PageSection title="Summary">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Number</div>
                <div>{invoice.number}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center gap-2"><StatusBadge status={invoice.status} kind="invoice" /></div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Issue date</div>
                <div>{invoice.date}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Due date</div>
                <div>{invoice.due}</div>
              </div>
              {invoice.subject && (
                <div className="space-y-1 sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Subject</div>
                  <div>{invoice.subject}</div>
                </div>
              )}
              {invoice.po && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">PO number</div>
                  <div>{invoice.po}</div>
                </div>
              )}
              {invoice.taxNumber && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tax number</div>
                  <div>{invoice.taxNumber}</div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Currency</div>
                <div>{invoice.currency || "Default"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-semibold">{formatCurrency(invoice.amount)}</div>
              </div>
            </div>
          </PageSection>
        </>
      )}
    </AppLayout>
  );
}
