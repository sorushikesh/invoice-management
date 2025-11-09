export interface ProductResponse {
  productId: string;
  name: string;
  sku: string;
  price: number;
  availableQuantity: number;
}

export interface CreateOrUpdateProductPayload {
  name: string;
  sku: string;
  price: number;
  availableQuantity: number;
}

