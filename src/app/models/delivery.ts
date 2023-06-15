import { Order } from './order';

export interface Delivery {
  id: string;
  order_id: Order;
  delivery_date: string;
  delivery_status: string;
  delivery_address: string;
}
