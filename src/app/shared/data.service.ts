import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private afs: AngularFirestore) {}

  // add product
  addProduct(product: Products) {
    product.id = this.afs.createId();
    return this.afs.collection('/Products').add(product);
  }

  // get all products
  getAllProducts() {
    return this.afs.collection('/Products').snapshotChanges();
  }

  // delete product
  deleteProduct(product: Products) {
    return this.afs.doc('/Products/' + product.id).delete();
  }

  // update productt
  updateProduct(product: Products) {
    this.deleteProduct(product);
    this.addProduct(product);
  }
}
