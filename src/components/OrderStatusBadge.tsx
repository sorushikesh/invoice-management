import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning hover:bg-warning/20" },
  processing: { label: "Processing", className: "bg-info/10 text-info hover:bg-info/20" },
  shipped: { label: "Shipped", className: "bg-primary/10 text-primary hover:bg-primary/20" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success hover:bg-success/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = statusConfig[status];
  if (!config) {
    return <Badge className="bg-muted text-muted-foreground">{status}</Badge>;
  }
  return <Badge className={config.className}>{config.label}</Badge>;
};
