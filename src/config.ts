export const API_BASE_URLS = {
  order: import.meta.env.VITE_ORDER_SERVICE_URL ?? "http://localhost:8081",
  product: import.meta.env.VITE_PRODUCT_SERVICE_URL ?? "http://localhost:8085",
  customer: import.meta.env.VITE_CUSTOMER_SERVICE_URL ?? "http://localhost:8086",
};

export const API_PATHS = {
  orders: "/api/orders",
  products: "/api/products",
  customers: "/api/customers",
};
