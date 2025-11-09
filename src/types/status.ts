export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export const backendToUiStatus = (status: string): OrderStatus => {
  switch (status) {
    case "PAID":
      return "processing";
    case "SHIPPED":
      return "shipped";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    case "CREATED":
    default:
      return "pending";
  }
};

