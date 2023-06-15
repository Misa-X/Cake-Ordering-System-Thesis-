import { Order } from './order';

export interface Payment {
  id: string;
  order_id: Order;
  payment_method: string;
  payment_amount: number;
  payment_status: string;
}
