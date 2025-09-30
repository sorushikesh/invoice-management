import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();

  // Placeholder lookup; later wire to API
  const client = {
    id,
    name: id === "c-002" ? "Globex Inc." : id === "c-003" ? "Initech" : "Acme Corp",
    email: "billing@example.com",
    phone: "+1 555 100 1000",
    address: "123 Main St, City, Country",
  };

  return (
    <AppLayout title="Client Details">
      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><span className="text-muted-foreground">Client ID:</span> {client.id}</div>
          <div><span className="text-muted-foreground">Email:</span> {client.email}</div>
          <div><span className="text-muted-foreground">Phone:</span> {client.phone}</div>
          <div><span className="text-muted-foreground">Address:</span> {client.address}</div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

