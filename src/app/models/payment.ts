import { Order } from './order';

export interface Payment {
  id: string;
  order: Order;
  payment_method: string;
  payment_status: string;
  payment_receipt: string;
}
