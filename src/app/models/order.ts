import { DeliveryItem } from './delivery-item';
import { OrderItem } from './order-item';

export interface Order {
  id: string;
  orderItem: OrderItem[];
  order_date: string;
  order_time: Date;
  order_status: string;
  payment_status: string;
  delivery: DeliveryItem;
  delivery_method: string;
  total: number;
}
