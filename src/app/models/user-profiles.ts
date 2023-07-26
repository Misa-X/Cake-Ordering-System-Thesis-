import { Delivery } from './delivery';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: Delivery;
  };
  image: string;
}
