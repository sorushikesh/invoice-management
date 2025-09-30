import { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ClientRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({ title: "Missing fields", description: "Name and Email are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // TODO: wire to clients service, e.g. apiFetch('/clients', { method: 'POST', body: { name, email, phone, address } })
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Client registered", description: `${name} has been added.` });
      navigate("/clients", { replace: true });
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Register New Client">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="billing@acme.com" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City" disabled={loading} />
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={loading}>Register Client</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
