import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";

const rows = [
  { number: "INV-1001", client: "Acme Corp", date: "2025-09-21", due: "2025-10-21", amount: 1250, status: "Sent" },
  { number: "INV-1002", client: "Globex", date: "2025-09-24", due: "2025-10-24", amount: 840, status: "Paid" },
  { number: "INV-1003", client: "Initech", date: "2025-09-28", due: "2025-10-28", amount: 1999, status: "Overdue" },
];

export default function InvoicesList() {
  const navigate = useNavigate();
  return (
    <AppLayout title="Invoices">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Invoices</h2>
        <Button onClick={() => navigate("/invoices/new")}>Create Invoice</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.number} className="cursor-pointer" onClick={() => navigate(`/invoices/${r.number}`)}>
                  <TableCell>{r.number}</TableCell>
                  <TableCell>{r.client}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.due}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.amount)}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Showing {rows.length} invoices</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
