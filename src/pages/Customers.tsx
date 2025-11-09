import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import { listCustomers } from "@/services/customerService";
import type { CustomerResponse } from "@/types/customer";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["customers", searchQuery],
    queryFn: () => listCustomers({ search: searchQuery || undefined, size: 200 }),
    keepPreviousData: true,
  });

  const rows = useMemo(() => {
    return (customers ?? []).map((customer) => {
      const name = `${customer.firstName} ${customer.lastName}`.trim();
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);
      return {
        ...customer,
        name,
        initials: initials || customer.firstName.charAt(0).toUpperCase(),
        joinDate: new Date(customer.createdAt).toLocaleDateString(),
      };
    });
  }, [customers]);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground mt-1">
              View and manage customer information
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer List</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isError && (
              <div className="text-destructive mb-4">
                Unable to load customers. Ensure the Customer Service is running.
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((customer: CustomerResponse & { name: string; initials: string; joinDate: string }) => (
                  <TableRow key={customer.customerId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {customer.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{customer.name}</span>
                          <p className="text-xs text-muted-foreground font-mono">
                            {customer.customerId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                    <TableCell>{customer.phone ?? "—"}</TableCell>
                    <TableCell>
                      {[customer.city, customer.state, customer.country]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </TableCell>
                    <TableCell>{customer.joinDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Customers;
