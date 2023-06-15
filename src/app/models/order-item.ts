import { Order } from './order';
import { Products } from './products';
import { Customization } from './customization';
import { Custom } from './custom';

export interface OrderItem {
  id: string;
  product: Products;
  customization: Custom;
  note: string;
  quantity: number;
  picture: string;
  subtotal: number;
}
