import { Category } from './category';

export interface Products {
  id: string;
  product_name: string;
  product_category: Category;
  product_description: string;
  product_image: string;
  product_price: number;
}
