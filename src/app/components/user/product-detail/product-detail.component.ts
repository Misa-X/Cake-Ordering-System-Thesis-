import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Customization } from 'src/app/models/customization';
import { Custom } from 'src/app/models/custom';
import { OrderItem } from 'src/app/models/order-item';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { CheckoutService } from 'src/app/shared/checkout.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productList: Products[] = [];
  customizations: Custom[] = [];
  product: any = {};
  orderItemList: OrderItem[] = [];

  fillingArray: Custom[] = [];
  flavorArray: Custom[] = [];
  sizeArray: Custom[] = [];

  orderItemObj: OrderItem = {
    id: '',
    product: {
      id: '',
      product_name: '',
      product_category: { id: '', category_name: '' },
      product_description: '',
      product_image: '',
      product_price: 0,
    },
    customization: [],
    color: '',
    note: '',
    quantity: 1,
    picture: '',
    subtotal: 0,
    // selected: false,
  };

  id: string = '';
  productt: string = '';

  customization: string[] = [];
  color: string = '';
  note: string = '';
  quantity: number = 1;
  picture: string = '';
  subtotal: number = 0;

  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  downloadURL: string | null = null;
  selectedOrderItem: Products | null = null;
  selectedOrderItemm: OrderItem | null = null;

  colorValue: string = '';
  quantityValue: number = 1;
  notesValue: string = '';
  pictureValue: any;

  selectedProduct: Products | null = null;

  selectedSize: string = ''; // Declare the selectedSize variable
  selectedFilling: string = ''; // Declare the selectedFilling variable
  selectedFlavor: string = ''; // Declare the selectedFlavor variable

  constructor(
    private data: DataService,
    private itemData: OrderItemService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage,
    private ItemData: CheckoutService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const productId = params.get('id');

          this.productt = productId !== null ? productId : '';

          return productId ? this.data.getProductById(productId) : of(null);
        })
      )
      .subscribe((product: unknown) => {
        if (product) {
          this.product = product as Products;
        } else {
          console.log('Product not found.');
        }
      });

    this.data.getAllProducts().subscribe((products) => {
      this.productList = products.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Products;
      });
    });

    this.data.getAllCustom().subscribe((res) => {
      this.customizations = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Custom;
      });

      console.log('Lista: ', this.customizations);

      this.sizeArray = this.customizations.filter(
        (custom) => custom.type === 'size'
      );
      this.fillingArray = this.customizations.filter(
        (custom) => custom.type === 'filling'
      );
      this.flavorArray = this.customizations.filter(
        (custom) => custom.type === 'flavor'
      );
    });
  }

  resetForm() {
    this.id = '';
    this.productt = '';
    this.customization = [];
    this.color = '';
    this.note = '';
    this.quantity = 0;
    this.picture = '';
    this.subtotal = 0;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  updateCustomization(custId: string) {
    console.log('Cust ID:', custId);
    if (this.customization.includes(custId)) {
      // Remove the custId from the customization array if it already exists
      this.customization = this.customization.filter((id) => id !== custId);
    } else {
      // Add the custId to the customization array if it doesn't exist
      this.customization.push(custId);
    }
  }

  addOrderItem() {
    console.log('Selected Product ID:', this.productt);
    console.log('Selected Customization ID:', this.customization);

    const selectedProduct = this.productList.find(
      (product) => product.id === this.productt
    );

    console.log('Selected Product:', selectedProduct);

    if (selectedProduct) {
      this.orderItemObj.product = selectedProduct;
    } else {
      console.log('Selected product not found.');
      return; // Stop the execution if the selected product is not found
    }

    const selectedCustomizationIds = this.customization;
    const selectedCustomizations = this.customizations.filter((custom) =>
      selectedCustomizationIds.includes(custom.id)
    );

    if (selectedCustomizations.length > 0) {
      this.orderItemObj.customization = selectedCustomizations;
    } else {
      console.log('Selected customizations not found.');
      return; // Stop the execution if the selected customizations are not found
    }

    console.log('Selected Customizations: ', selectedCustomizations);

    this.orderItemObj.color = this.color;
    this.orderItemObj.note = this.note;
    this.orderItemObj.quantity = this.quantity;
    this.orderItemObj.subtotal = this.subtotal;

    if (this.selectedFile) {
      const filePath = `image_upload/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((imageUrl) => {
              this.orderItemObj.picture = imageUrl;
              this.itemData.addOrderItem(this.orderItemObj);

              // .then(() => {
              //   const subtotal = this.itemData.calculateSubtotal(
              //     this.orderItemObj
              //   );
              //   this.orderItemObj.subtotal = subtotal;
              //   console.log('some oject: ', this.orderItemObj);
              // })

              // this.itemData
              //   .updateOrderItemSubtotal(this.orderItemObj)
              //   .then(() => {
              //     this.resetForm();
              //   })
              //   .catch((error) => {
              //     console.log('Error updating order item subtotal:', error);
              //   })
              //   .catch((error) => {
              //     console.log('Error adding order item:', error);
              //   });

              this.resetForm();
            });
          })
        )
        .subscribe();
    } else {
      // try {
      //   const docRef = await this.itemData.addOrderItem(this.orderItemObj);
      //   this.orderItemList.push(this.orderItemObj); // Add the newly created order item to the order item list

      //   await this.itemData.updateOrderItemSubtotal(this.orderItemObj);
      //   console.log('Subtotal updated successfully.');

      //   this.resetForm();
      // } catch (error) {

      //   console.log('Error adding order item or updating subtotal:', error);
      // }

      // this.orderItemObj.picture = this.selectedOrderItemm.picture;
      this.itemData.addOrderItem(this.orderItemObj);
      this.resetForm();
    }
  }

  addCheckoutItem() {
    console.log('Selected Product ID:', this.productt);
    console.log('Selected Customization ID:', this.customization);

    const selectedProduct = this.productList.find(
      (product) => product.id === this.productt
    );

    console.log('Selected Product:', selectedProduct);

    if (selectedProduct) {
      this.orderItemObj.product = selectedProduct;
    } else {
      console.log('Selected product not found.');
      return; // Stop the execution if the selected product is not found
    }

    const selectedCustomizationIds = this.customization;
    const selectedCustomizations = this.customizations.filter((custom) =>
      selectedCustomizationIds.includes(custom.id)
    );

    if (selectedCustomizations.length > 0) {
      this.orderItemObj.customization = selectedCustomizations;
    } else {
      console.log('Selected customizations not found.');
      return; // Stop the execution if the selected customizations are not found
    }

    console.log('Selected Customizations: ', selectedCustomizations);

    this.orderItemObj.color = this.color;
    this.orderItemObj.note = this.note;
    this.orderItemObj.quantity = this.quantity;
    this.orderItemObj.subtotal = this.subtotal;

    if (this.selectedFile) {
      const filePath = `image_upload/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((imageUrl) => {
              this.orderItemObj.picture = imageUrl;
              this.ItemData.addCheckoutItem(this.orderItemObj);

              // .then(() => {
              //   const subtotal = this.itemData.calculateSubtotal(
              //     this.orderItemObj
              //   );
              //   this.orderItemObj.subtotal = subtotal;
              //   console.log('some oject: ', this.orderItemObj);
              // })

              // this.itemData
              //   .updateOrderItemSubtotal(this.orderItemObj)
              //   .then(() => {
              //     this.resetForm();
              //   })
              //   .catch((error) => {
              //     console.log('Error updating order item subtotal:', error);
              //   })
              //   .catch((error) => {
              //     console.log('Error adding order item:', error);
              //   });

              this.resetForm();
            });
          })
        )
        .subscribe();
    } else {
      // try {
      //   const docRef = await this.itemData.addOrderItem(this.orderItemObj);
      //   this.orderItemList.push(this.orderItemObj); // Add the newly created order item to the order item list

      //   await this.itemData.updateOrderItemSubtotal(this.orderItemObj);
      //   console.log('Subtotal updated successfully.');

      //   this.resetForm();
      // } catch (error) {

      //   console.log('Error adding order item or updating subtotal:', error);
      // }

      // this.orderItemObj.picture = this.selectedOrderItemm.picture;
      this.ItemData.addCheckoutItem(this.orderItemObj);
      this.resetForm();
    }
  }

  checkout() {
    this.addOrderItem();

    const addedItemId = this.orderItemObj.id;

    console.log('Added Order Item ID:', addedItemId);

    // Navigate to the checkout page with the order item ID as a parameter
    // this.router.navigate(['/user/checkout', addedItemId]);

    // Navigate to the checkout page with the order item ID as a parameter
    const checkoutUrl = `/user/checkout/${addedItemId}`;
    this.router.navigateByUrl(checkoutUrl);
  }

  // calculateCustomization(item: OrderItem) {
  //   const productPrice = parseFloat(item.product.product_price.toString());
  //   let totalPrice = productPrice; // Initialize totalPrice with the product price

  //   item.customization.forEach((customization: Custom) => {
  //     const custPrice = parseFloat(customization.price.toString());
  //     if (!isNaN(custPrice)) {
  //       totalPrice += custPrice;
  //     }
  //   });

  //   item.subtotal = totalPrice;

  //   this.itemData
  //     .updateOrderItem(item)
  //     .then(() => {
  //       console.log('Subtotal updated:', item.subtotal);
  //       // this.subtotal = item.subtotal;
  //     })
  //     .catch((error) => {
  //       console.error('Error updating order item:', error);
  //     });
  // }

  calcSubtotal(item: OrderItem) {
    console.log('Faulty item: ', item);
    if (!item || !item.product || !item.product.product_price) {
      console.error('Invalid item or missing properties.');
      return;
    }
    // const productPrice = parseFloat(item.product.product_price.toString());

    console.log('Product Price : ', item.product.product_price);
    if (!isNaN(item.product.product_price)) {
      item.subtotal += item.product.product_price;

      item.customization.forEach((custom: Custom) => {
        item.subtotal += custom.price;
      });
    } else {
      item.subtotal = 0;
    }

    this.itemData
      .updateOrderItem(item)
      .then(() => {
        this.subtotal = item.subtotal;
        // Update the subtotal locally after successful update in the database
        console.log('calc sub 2:', this.subtotal);
      })
      .catch((error) => {
        console.error('Error updating order item:', error);
      });
  }
}
