import { API_BASE_URLS, API_PATHS } from "@/config";
import { request } from "@/lib/http";
import type {
  CreateOrderPayload,
  OrderResponse,
  PageResponse,
  BackendOrderStatus,
} from "@/types/order";

const baseUrl = API_BASE_URLS.order;

export const listOrders = (params?: { page?: number; size?: number; userId?: string; status?: BackendOrderStatus }) =>
  request<PageResponse<OrderResponse>>(baseUrl, API_PATHS.orders, {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 50,
      userId: params?.userId,
      status: params?.status,
    },
  });

export const getOrder = (orderId: string) =>
  request<OrderResponse>(baseUrl, `${API_PATHS.orders}/${orderId}`);

export const createOrder = (payload: CreateOrderPayload) =>
  request<OrderResponse>(baseUrl, API_PATHS.orders, {
    method: "POST",
    body: payload,
  });

export const cancelOrder = (orderId: string) =>
  request<void>(baseUrl, `${API_PATHS.orders}/${orderId}`, { method: "DELETE" });

export const updateShipmentStatus = (orderId: string, status: "SHIPPED" | "DELIVERED") =>
  request<OrderResponse>(baseUrl, `${API_PATHS.orders}/${orderId}/shipment-status`, {
    method: "PUT",
    body: { status },
  });

export const updatePaymentStatus = (orderId: string, status: "SUCCESS" | "FAILED") =>
  request<OrderResponse>(baseUrl, `${API_PATHS.orders}/${orderId}/payment-status`, {
    method: "PUT",
    body: { status },
  });

