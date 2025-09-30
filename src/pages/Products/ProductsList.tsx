import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/settings";

const products = [
  { id: "p-001", name: "Consulting Hours", sku: "CONS-HR", unit: "hour", price: 80 },
  { id: "p-002", name: "Website Design", sku: "WEB-DSN", unit: "project", price: 2500 },
  { id: "p-003", name: "Hosting", sku: "HOST-M", unit: "month", price: 25 },
];

export default function ProductsList() {
  const navigate = useNavigate();
  return (
    <AppLayout title="Products">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Catalog</h2>
        <Button onClick={() => navigate("/products/new")}>Add Product/Service</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products & Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Showing {products.length} items</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
