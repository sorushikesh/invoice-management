import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { listProducts } from "@/services/productService";
import { createOrder } from "@/services/orderService";
import { listCustomers } from "@/services/customerService";
import type { ProductResponse } from "@/types/product";
import type { CustomerResponse } from "@/types/customer";

interface OrderItemForm {
  id: string;
  productId?: string;
  productName?: string;
  quantity: number;
  price: number;
}

const generateId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const CreateOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerId, setCustomerId] = useState<string>(generateId);
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([
    { id: generateId(), quantity: 1, price: 0 },
  ]);

  const {
    data: customers,
    isLoading: customersLoading,
    isError: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", "order-form"],
    queryFn: () => listCustomers({ size: 200 }),
  });

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      toast({
        title: "Order Created",
        description: `Order ${order.orderId} has been created.`,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(`/orders/${order.orderId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Order creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addOrderItem = () => {
    setOrderItems((items) => [
      ...items,
      { id: generateId(), quantity: 1, price: 0 },
    ]);
  };

  const removeOrderItem = (id: string) => {
    setOrderItems((items) => (items.length > 1 ? items.filter((item) => item.id !== id) : items));
  };

  const updateOrderItem = (id: string, updater: (item: OrderItemForm) => OrderItemForm) => {
    setOrderItems((items) => items.map((item) => (item.id === id ? updater(item) : item)));
  };

  const handleProductChange = (id: string, productId: string) => {
    const product = products?.find((p) => p.productId === productId);
    updateOrderItem(id, (item) => ({
      ...item,
      productId,
      productName: product?.name ?? item.productName,
      price: product?.price ?? item.price,
    }));
  };

  const totalAmount = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [orderItems],
  );

  const selectedCustomer = useMemo<CustomerResponse | undefined>(() => {
    return customers?.find((customer) => customer.customerId === customerId);
  }, [customers, customerId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const missingProduct = orderItems.some((item) => !item.productId);
    if (missingProduct) {
      toast({
        title: "Missing product selection",
        description: "Select a product for every order line before submitting.",
        variant: "destructive",
      });
      return;
    }

    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidPattern.test(customerId)) {
      toast({
        title: "Invalid customer ID",
        description: "Provide a valid UUID for the customer (e.g. 123e4567-e89b-12d3-a456-426614174000).",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      userId: customerId,
      items: orderItems.map((item) => ({
        productId: item.productId!,
        productName: item.productName ?? "",
        quantity: item.quantity,
        price: item.price,
      })),
    });
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Create New Order
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter order details and customer information
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Customer Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Enter customer details for this order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customersError && (
                  <div className="flex items-center justify-between rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <span>Unable to load customers.</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => refetchCustomers()}>
                      Retry
                    </Button>
                  </div>
                )}
                {customers && customers.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="existingCustomer">Select Existing Customer</Label>
                    <Select
                      value={selectedCustomer?.customerId ?? undefined}
                      onValueChange={(value) => setCustomerId(value)}
                      disabled={customersLoading || createOrderMutation.isPending}
                    >
                      <SelectTrigger id="existingCustomer">
                        <SelectValue
                          placeholder={
                            customersLoading ? "Loading customers..." : "Choose customer (optional)"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer: CustomerResponse) => (
                          <SelectItem key={customer.customerId} value={customer.customerId}>
                            {customer.firstName} {customer.lastName} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCustomer && (
                      <div className="rounded-md border border-muted bg-muted/20 p-3 text-sm text-muted-foreground">
                        <p>{selectedCustomer.email}</p>
                        <p>{selectedCustomer.phone ?? "Phone not provided"}</p>
                        <p>
                          {[selectedCustomer.city, selectedCustomer.state, selectedCustomer.country]
                            .filter(Boolean)
                            .join(", ") || "Location not provided"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID (UUID)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customerId"
                      name="customerId"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="font-mono"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCustomerId(generateId())}
                      title="Generate new ID"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This value is sent to the Order Service as <code>userId</code>.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input id="customerName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input id="customerEmail" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input id="customerPhone" type="tel" placeholder="+1 (555) 000-0000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Order Date</Label>
                    <Input id="orderDate" type="date" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
                <CardDescription>Delivery information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Textarea id="shippingAddress" placeholder="123 Main St" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" required />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" placeholder="10001" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>Add products to this order</CardDescription>
                  </div>
                  <Button type="button" onClick={addOrderItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {productsError && (
                  <div className="mb-4 flex items-center justify-between rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <span>Unable to load products. Ensure the Product Service is available.</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => refetchProducts()}>
                      Retry
                    </Button>
                  </div>
                )}
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`product-${item.id}`}>Product</Label>
                        <Select
                          value={item.productId ?? ""}
                          onValueChange={(value) => handleProductChange(item.id, value)}
                          disabled={productsLoading || productsError}
                          required
                        >
                          <SelectTrigger id={`product-${item.id}`}>
                            <SelectValue
                              placeholder={productsLoading ? "Loading products..." : "Select product"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {products?.map((product: ProductResponse) => (
                              <SelectItem key={product.productId} value={product.productId}>
                                {product.name} ({product.sku})
                              </SelectItem>
                            ))}
                            {!productsLoading && products && products.length === 0 && (
                              <SelectItem value="__empty" disabled>
                                No products available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24 space-y-2">
                        <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const nextValue = Number.parseInt(e.target.value, 10);
                            updateOrderItem(item.id, (current) => ({
                              ...current,
                              quantity: Number.isNaN(nextValue) || nextValue < 1 ? 1 : nextValue,
                            }));
                          }}
                          required
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label htmlFor={`price-${item.id}`}>Price ($)</Label>
                        <Input
                          id={`price-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => {
                            const nextValue = Number.parseFloat(e.target.value);
                            updateOrderItem(item.id, (current) => ({
                              ...current,
                              price: Number.isNaN(nextValue) || nextValue < 0 ? 0 : nextValue,
                            }));
                          }}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOrderItem(item.id)}
                        disabled={orderItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Additional Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment & Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select required>
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Order Priority</Label>
                    <Select required>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special instructions or notes for this order..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={createOrderMutation.isPending}>
                  {createOrderMutation.isPending ? "Creating..." : "Create Order"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/orders")}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateOrder;
