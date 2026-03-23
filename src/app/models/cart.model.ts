export interface CartItem {
  id: number;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartSummary {
  subtotal: number;
  vatAmount: number;
  total: number;
}