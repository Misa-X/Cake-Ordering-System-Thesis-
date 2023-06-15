import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private products: ProductResponseModel[] = [];

  constructor(private afs: AngularFirestore) {}

  getOrderById(id: string) {
    return this.afs
      .collection('/Orders', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((order) => order[0]) // Retrieve the first matching order
      );
  }
}
interface ProductResponseModel {
  id: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  image: string;
}
