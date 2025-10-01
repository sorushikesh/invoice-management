import AppLayout from "@/layouts/AppLayout";
import { useParams } from "react-router-dom";

export default function InvoicePreview() {
  const { id } = useParams();
  // TODO: Fetch a signed PDF URL from backend
  const pdfUrl = `/api/invoices/${id}/pdf`; // placeholder
  return (
    <AppLayout
      title={`Preview ${id}`}
      breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Invoices", to: "/invoices" }, { label: String(id), to: `/invoices/${id}` }, { label: "Preview" }]}
    >
      <div className="w-full h-[80vh] border rounded">
        <iframe title="invoice-pdf" src={pdfUrl} className="w-full h-full" />
      </div>
    </AppLayout>
  );
}
