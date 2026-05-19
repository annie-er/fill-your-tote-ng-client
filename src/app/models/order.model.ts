export interface Order {
  id: number;
  datePurchased: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  productName: string;
  description: string;
  imageUrl: string;
  quantity: number;
  priceAtPurchase: number;
}