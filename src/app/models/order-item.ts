import { Products } from './products';
import { Custom } from './custom';
import { UserProfile } from './user-profiles';

export interface OrderItem {
  id: string;
  user: UserProfile;
  product: Products;
  customization: Custom[];
  color: string;
  note: string;
  quantity: number;
  picture: string;
  subtotal: number;
  selected: boolean;
}
