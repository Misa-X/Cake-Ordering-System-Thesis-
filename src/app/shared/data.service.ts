import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Category } from '../models/category';
import { Products } from '../models/products';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';
import { Customization } from '../models/customization';
import { Custom } from '../models/custom';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private itemDoc!: AngularFirestoreDocument<Products>;
  constructor(private afs: AngularFirestore) {}

  // PRODUCT ---------->
  // add product
  addProduct(product: Products) {
    product.id = this.afs.createId();
    return this.afs.collection('/Products').add(product);
  }

  // get all products
  getAllProducts() {
    return this.afs.collection('/Products').snapshotChanges();
  }

  //get product by id
  getProductById(id: string) {
    console.log(id);
    return this.afs
      .collection('/Products', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((products) => products[0]) // Retrieve the first matching product
      );
  }

  // delete product
  deleteProduct(product: Products) {
    return this.afs.doc('/Products/' + product.id).delete();
  }

  // update product
  updateProduct(product: Products) {
    // this.deleteProduct(product);
    // this.addProduct(product);

    const productRef = this.afs.collection('/Products').doc(product.id);

    console.log('product ref: ', product.id);

    productRef
      .update(product)
      .then(() => {
        console.log('Product updated successfully');
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });

    // this.itemDoc = this.afs.doc(`/Products/${product.id}`);
    // const itemId = this.itemDoc.ref.id;
    // product.id = itemId;
    // return this.itemDoc.update(product);
  }

  //CATEGORY ---------->
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

  // ORDER ---------->
  // create order
  createOrder(order: Order) {
    return this.afs.collection('/Orders').add(order);
  }

  // get all orders
  getAllOrders() {
    return this.afs.collection('/Orders').snapshotChanges();
  }

  //get order by id
  getOrderById(id: string) {
    return this.afs
      .collection('/Orders', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((order) => order[0]) // Retrieve the first matching order
      );
  }

  // delete order
  deleteOrder(order: Order) {
    return this.afs.doc('/Orders/' + order.id).delete();
  }

  // update order
  updateOrder(order: Order) {
    this.deleteOrder(order);
    this.createOrder(order);
  }

  /*
   ----------  Cart Product Function  ----------
  */

  // Adding new Product to cart db if logged in else localStorage
  addToCart(cust: Customization): void {
    const a: Customization[] = JSON.parse(
      localStorage.getItem('avct_item') || '[]'
    );
    a.push(cust);
    console.log('cust :', cust);
    console.log(a);

    // this.toastrService.wait(
    //   "Adding Product to Cart",
    //   "Product Adding to the cart"
    // );
    setTimeout(() => {
      localStorage.setItem('avct_item', JSON.stringify(a));
    }, 500);
  }

  // Removing cart from local
  removeLocalCartProduct(product: Customization) {
    const products: Customization[] = JSON.parse(
      localStorage.getItem('avct_item') || '[]'
    );

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === product.id) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem('avct_item', JSON.stringify(products));
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Customization[] {
    const productsString: string | null = localStorage.getItem('avct_item');
    const products: Customization[] = productsString
      ? JSON.parse(productsString)
      : [];

    return products;
  }

  /* -----------Customization--------- */

  // add customization
  addCustom(custom: Custom) {
    custom.id = this.afs.createId();
    return this.afs.collection('/Customization').add(custom);
  }

  // get all customization
  getAllCustom() {
    return this.afs.collection('/Customization').snapshotChanges();
  }

  //get customization by id
  getCustomById(id: string) {
    return this.afs
      .collection('/Customization', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(map((custom) => custom[0]));
  }

  // delete customization
  deleteCustom(custom: Custom) {
    return this.afs.doc('/Customization/' + custom.id).delete();
  }

  // update customization
  updateCustom(custom: Custom) {
    this.deleteCustom(custom);
    this.addCustom(custom);
  }
}
