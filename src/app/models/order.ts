import { Customer } from './customer';
import { Delivery } from './delivery';
import { DeliveryItem } from './delivery-item';
import { OrderItem } from './order-item';
import { Payment } from './payment';
import { UserProfile } from './user-profiles';

export interface Order {
  id: string;
  orderItem: OrderItem[];
  order_date: string;
  order_time: string;
  order_status: string;
  payment_status: string;
  delivery: DeliveryItem;
  total: number;
}
