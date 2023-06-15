import { Customer } from './customer';
import { Delivery } from './delivery';
import { Payment } from './payment';

export interface Order {
  id: string;
  order_date: string;
  order_status: string;
  customer_id: Customer;
  delivery_id: Delivery;
  payment_id: Payment;
}
