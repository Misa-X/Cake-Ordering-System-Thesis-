import { UserProfile } from './user-profiles';
import { OrderItem } from './order-item';
import { Order } from './order';

export interface Notification {
  id: string; // Unique identifier for the notification
  // user: UserProfile[]; // User associated with the notification
  text: string; // Notification message or text
  time: string; // Timestamp for when the notification was created
  status: 'new' | 'read'; // Status of the notification (unread or read)
  order: Order; // ID or reference to the associated order
}
