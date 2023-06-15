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

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productList: Products[] = [];
  customizations: Custom[] = [];
  product: any = {};
  // customList: Custom[] = [];
  orderItemList: OrderItem[] = [];

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
    customization: {
      id: '',
      name: '',
      type: '',
      price: 0,
    },
    note: '',
    quantity: 0,
    picture: '',
    subtotal: 0,
  };

  id: string = '';
  productt: string = '';
  customization: string = '';
  note: string = '';
  quantity: number = 0;
  picture: string = '';
  subtotal: number = 0;

  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  downloadURL: string | null = null;
  selectedOrderItem: Products | null = null;

  // custom: Customization = {
  //   id: '',
  //   prod: {
  //     id: '',
  //     product_name: '',
  //     product_category: { id: '', category_name: '' },
  //     product_description: '',
  //     product_image: '',
  //     product_price: 0,
  //   },
  //   color: '',
  //   size: 0,
  //   filling: '',
  //   flavor: '',
  // };

  // customObj: Custom = {
  //   id: '',
  //   name: '',
  //   type: '',
  //   price: '',
  // };

  // custom_id: string = '';
  // name: string = '';
  // type: string = '';

  quantityValue: number = 1;
  notesValue: string = '';
  pictureValue: any;

  selectedProduct: Products | null = null;

  constructor(
    private data: DataService,
    private itemData: OrderItemService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const productId = params.get('id');

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
    });

    // this.getAllCustom();
  }

  resetForm() {
    this.id = '';
    this.productt = '';
    this.customization = '';
    this.note = '';
    this.quantity = 0;
    this.picture = '';
    this.subtotal = 0;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addOrderItem() {
    const selectedProduct = this.productList.find(
      (product) => product.id === this.productt
    );

    if (selectedProduct) {
      this.orderItemObj.product = selectedProduct;
    } else {
      this.orderItemObj.product = {
        id: '',
        product_name: '',
        product_category: { id: '', category_name: '' },
        product_description: '',
        product_image: '',
        product_price: 0,
      };
    }

    const selectedCustomization = this.customizations.find(
      (custom) => custom.id === this.customization
    );

    if (selectedCustomization) {
      this.orderItemObj.customization = selectedCustomization;
    } else {
      this.orderItemObj.customization = {
        id: '',
        name: '',
        type: '',
        price: 0,
      };
    }

    this.orderItemObj.note = this.note;
    this.orderItemObj.quantity = this.quantity;
    // this.orderItemObj.picture = this.picture;
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
              this.resetForm();
            });
          })
        )
        .subscribe();
    } else {
      this.itemData.addOrderItem(this.orderItemObj);
      this.resetForm();
    }
  }

  /*
  addToCart(cust: Customization) {
    console.log('The category ', this.product.product_category);
    this.custom.prod.product_name = this.product.product_name;
    this.custom.prod.product_description = this.product.product_description;
    this.custom.prod.product_image = this.product.product_image;
    this.custom.prod.product_price = this.product.product_price;
    this.custom.prod.product_category = this.product.product_category;

    // prod: {
    //   id: '',
    //   product_name: '',
    //   product_category: { id: '', category_name: '' },
    //   product_description: '',
    //   product_image: '',
    //   product_price: 0,
    // },

    // Get the form data here

    const formData = {
      color: this.custom.color,
      size: this.custom.size,
      cakeFilling: this.custom.filling,
      cakeFlavor: this.custom.flavor,
      quantity: this.quantityValue,
      notes: this.notesValue,
      picture: this.pictureValue,
    };
    console.log('form data: ', formData);

    // Navigate to the cart component and pass the form data as route parameters
    this.router.navigate(['/cart'], { queryParams: formData });

    // Add the product to the cart (your existing code)
    this.data.addToCart(this.custom);
  }

  // get all customizations
  getAllCustom() {
    this.data.getAllCustom().subscribe((res) => {
      this.customList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.pauload.doc.id;
        return { id, ...data } as Custom;
      });
    });
  }
*/
}
