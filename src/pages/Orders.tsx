import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCw, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { listOrders } from "@/services/orderService";
import { backendToUiStatus } from "@/types/status";
import type { OrderResponse } from "@/types/order";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders({ size: 200 }).then((res) => res.content),
  });

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    return data.filter((order) => {
      const haystack = [
        order.orderId,
        order.userId,
        ...order.items.map((item) => item.productName),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery]);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" style={{ animationPlayState: isLoading ? "running" : "paused" }} />
              Refresh
            </Button>
            <Link to="/orders/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Orders</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isError && (
              <div className="text-destructive mb-4">
                Unable to load orders. Please verify the Order Service is running and try again.
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredOrders.map((order: OrderResponse) => {
                  const uiStatus = backendToUiStatus(order.status);
                  const createdAt = new Date(order.timestamp);
                  return (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell className="font-mono text-sm">{order.userId}</TableCell>
                      <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.totalAmount ?? 0)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={uiStatus} />
                      </TableCell>
                      <TableCell>{createdAt.toLocaleString()}</TableCell>
                      <TableCell>
                        <Link to={`/orders/${order.orderId}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Orders;
