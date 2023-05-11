import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../models/category';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private afs: AngularFirestore) {}

  // PRODUCT
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

  //CATEGORY
  // add category
  addCategory(category: Category) {
    category.id = this.afs.createId();
    return this.afs.collection('/Categories').add(category);
  }

  // get all categories
  getAllCategories() {
    return this.afs.collection('/Categories').snapshotChanges();
  }

  // delete category
  deleteCategory(category: Category) {
    return this.afs.doc('/Categories/' + category.id).delete();
  }

  // update category
  updateCategory(category: Category) {
    this.deleteCategory(category);
    this.addCategory(category);
  }
}
