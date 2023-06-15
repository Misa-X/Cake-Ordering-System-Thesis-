import { Products } from './products';

export interface Cart {
  total: number;
  prodData: [
    {
      product_id: Products;
      incart: number;
    }
  ];
}
