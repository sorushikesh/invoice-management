import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";

const payments = [
  { id: "pm-001", invoice: "INV-1002", date: "2025-09-25", method: "Card", amount: 840 },
  { id: "pm-002", invoice: "INV-1001", date: "2025-09-27", method: "Bank", amount: 600 },
  { id: "pm-003", invoice: "INV-1003", date: "2025-10-02", method: "Cash", amount: 500 },
];

export default function PaymentsList() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Payments">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Payments</h2>
        <Button onClick={() => navigate("/payments/new")}>Record Payment</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments & Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.invoice}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Showing {payments.length} payments</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
