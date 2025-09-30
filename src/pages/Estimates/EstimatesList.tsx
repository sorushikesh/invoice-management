import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";
import { toast } from "@/hooks/use-toast";

const rows = [
  { number: "EST-2001", client: "Acme Corp", date: "2025-09-15", amount: 950, status: "Sent" },
  { number: "EST-2002", client: "Globex", date: "2025-09-20", amount: 1200, status: "Accepted" },
  { number: "EST-2003", client: "Initech", date: "2025-09-26", amount: 650, status: "Draft" },
];

export default function EstimatesList() {
  const navigate = useNavigate();

  const convertToInvoice = (estNumber: string) => {
    toast({ title: "Converted", description: `${estNumber} converted to invoice draft.` });
    navigate("/invoices/new");
  };

  return (
    <AppLayout title="Estimates">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Estimates</h2>
        <Button onClick={() => navigate("/estimates/new")}>Create Estimate</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotes / Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.number}>
                  <TableCell>{r.number}</TableCell>
                  <TableCell>{r.client}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell className="text-right">{formatCurrency(r.amount)}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => convertToInvoice(r.number)}>
                      Convert to Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Showing {rows.length} estimates</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
