import type { OrderStatus } from "./status";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: BackendOrderStatus;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

export type BackendOrderStatus = "CREATED" | "PAID" | "CANCELLED" | "SHIPPED" | "DELIVERED";

export interface CreateOrderPayload {
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface UpdateOrderStatusPayload {
  status: BackendOrderStatus;
}

export type UiOrderStatus = OrderStatus;

