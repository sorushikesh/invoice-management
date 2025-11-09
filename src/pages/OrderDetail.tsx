import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { OrderPipeline } from "@/components/OrderPipeline";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "@/services/orderService";
import { backendToUiStatus } from "@/types/status";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    enabled: Boolean(id),
    queryFn: () => getOrder(id!),
  });

  const order = data;

  const totals = useMemo(() => {
    if (!order) {
      return {
        subtotal: 0,
        total: 0,
      };
    }
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return {
      subtotal,
      total: order.totalAmount ?? subtotal,
    };
  }, [order]);

  const uiStatus = order ? backendToUiStatus(order.status) : "pending";

  return (
    <Layout>
      <div className="p-8">
        <Link to="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {isError && (
          <div className="text-destructive mb-6">
            Unable to load the order. Confirm the Order Service is available and the order ID is valid.
          </div>
        )}

        {isLoading && !order && (
          <div className="text-muted-foreground">Loading order details...</div>
        )}

        {order && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Order {order.orderId}</h1>
                <p className="text-muted-foreground mt-1">
                  Placed on {new Date(order.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer ID: <span className="font-mono">{order.userId}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={uiStatus} />
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderPipeline currentStatus={uiStatus === "cancelled" ? "pending" : uiStatus} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.productName}`}
                          className="flex justify-between items-center py-3 border-b border-border last:border-0"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}

                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                          <span>Total</span>
                          <span>{formatCurrency(totals.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Shipping details are not captured for this order.</p>
                    <p className="text-xs">
                      Extend the Order Service payload and UI form to store shipping information if required.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Payment orchestration is handled server-side.</p>
                    <p className="text-xs">
                      Use the Payment Service dashboard or logs to inspect payment details.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetail;
