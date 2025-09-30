import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const clients = [
  { id: "c-001", name: "Acme Corp", email: "billing@acme.com", phone: "+1 555 100 1000" },
  { id: "c-002", name: "Globex Inc.", email: "ap@globex.com", phone: "+1 555 200 2000" },
  { id: "c-003", name: "Initech", email: "accounts@initech.com", phone: "+1 555 300 3000" },
];

export default function ClientsList() {
  const navigate = useNavigate();
  return (
    <AppLayout title="Clients">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Clients</h2>
        <Button onClick={() => navigate("/clients/new")}>Register New Client</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/clients/${c.id}`)}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Showing {clients.length} clients</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

