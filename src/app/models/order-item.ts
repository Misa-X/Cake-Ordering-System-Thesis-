import { Products } from './products';
import { Custom } from './custom';

export interface OrderItem {
  id: string;
  product: Products;
  customization: Custom[];
  color: string;
  note: string;
  quantity: number;
  picture: string;
  subtotal: number;
}
