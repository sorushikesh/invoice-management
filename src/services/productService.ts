import { API_BASE_URLS, API_PATHS } from "@/config";
import { request } from "@/lib/http";
import type { CreateOrUpdateProductPayload, ProductResponse } from "@/types/product";

const baseUrl = API_BASE_URLS.product;

export const listProducts = () =>
  request<ProductResponse[]>(baseUrl, API_PATHS.products);

export const getProduct = (productId: string) =>
  request<ProductResponse>(baseUrl, `${API_PATHS.products}/${productId}`);

export const createProduct = (payload: CreateOrUpdateProductPayload) =>
  request<ProductResponse>(baseUrl, API_PATHS.products, {
    method: "POST",
    body: payload,
  });

export const updateProduct = (productId: string, payload: CreateOrUpdateProductPayload) =>
  request<ProductResponse>(baseUrl, `${API_PATHS.products}/${productId}`, {
    method: "PUT",
    body: payload,
  });

export const deleteProduct = (productId: string) =>
  request<void>(baseUrl, `${API_PATHS.products}/${productId}`, { method: "DELETE" });

