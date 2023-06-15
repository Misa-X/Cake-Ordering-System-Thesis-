import { Products } from './products';

export interface Customization {
  id: string;
  prod: Products;
  color: string;
  size: number;
  filling: string;
  flavor: string;
}
