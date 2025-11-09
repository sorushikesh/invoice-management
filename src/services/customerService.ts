import { API_BASE_URLS, API_PATHS } from "@/config";
import { request } from "@/lib/http";
import type { CreateOrUpdateCustomerPayload, CustomerResponse } from "@/types/customer";

const baseUrl = API_BASE_URLS.customer;

type Page<T> = {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
};

export const listCustomers = (params?: { search?: string; page?: number; size?: number }) =>
  request<Page<CustomerResponse>>(baseUrl, API_PATHS.customers, {
    query: {
      search: params?.search,
      page: params?.page ?? 0,
      size: params?.size ?? 100,
    },
  }).then((page) => page.content);

export const getCustomer = (id: string) =>
  request<CustomerResponse>(baseUrl, `${API_PATHS.customers}/${id}`);

export const createCustomer = (payload: CreateOrUpdateCustomerPayload) =>
  request<CustomerResponse>(baseUrl, API_PATHS.customers, {
    method: "POST",
    body: payload,
  });

export const updateCustomer = (id: string, payload: CreateOrUpdateCustomerPayload) =>
  request<CustomerResponse>(baseUrl, `${API_PATHS.customers}/${id}`, {
    method: "PUT",
    body: payload,
  });

export const deleteCustomer = (id: string) =>
  request<void>(baseUrl, `${API_PATHS.customers}/${id}`, { method: "DELETE" });

