import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/models/category';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Products } from 'src/app/models/products';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {
  product: any = {};
  productList: Products[] = [];
  categories: Category[] = [];

  isEditMode = false;

  productObj: Products = {
    id: '',
    product_name: '',
    product_category: { id: '', category_name: '' },
    product_description: '',
    product_image: '',
    product_price: 0,
  };
  id: string = '';
  product_name: string = '';
  product_category: string = '';
  product_description: string = '';
  product_image: string = '';
  product_price: number = 0;

  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  downloadURL: string | null = null;
  selectedProduct: Products | null = null;

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private data: DataService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    console.log('data from table', this.data);
    this.getAllCategories();
    if (this.datas) {
      this.productObj = { ...this.datas.productObj }; // Assign a copy of the received product data to the component variable
      this.isEditMode = true;
    }
  }

  getAllCategories() {
    this.data.getAllCategories().subscribe((res) => {
      this.categories = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Category;
      });
    });
  }

  resetForm() {
    // this.id = '';
    // this.product_name = '';
    // this.product_category = '';
    // this.product_description = '';
    // this.product_image = '';
    // this.product_price = 0;

    this.productObj = {
      id: '',
      product_name: '',
      product_category: { id: '', category_name: '' },
      product_description: '',
      product_image: '',
      product_price: 0,
    };
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // add product
  addProduct() {
    if (
      this.product_name == '' ||
      this.product_description == '' ||
      this.product_category == '' ||
      this.product_price == 0
    ) {
      alert('Fill all input fields');
      return;
    }

    this.productObj.product_name = this.product_name;
    this.productObj.product_description = this.product_description;
    const selectedCategory = this.categories.find(
      (category) => category.id === this.product_category
    );

    if (selectedCategory) {
      this.productObj.product_category = selectedCategory;
    } else {
      this.productObj.product_category = {
        id: '',
        category_name: '',
      };
    }

    this.productObj.product_price = this.product_price;

    if (this.selectedProduct) {
      // Update existing product
      this.productObj.id = this.selectedProduct.id;
      if (this.selectedFile) {
        const filePath = `product_images/${Date.now()}_${
          this.selectedFile.name
        }`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((imageUrl) => {
                this.productObj.product_image = imageUrl;
                this.data.updateProduct(this.productObj);
                this.resetForm();
              });
            })
          )
          .subscribe();
      } else {
        this.productObj.product_image = this.selectedProduct.product_image;
        this.data.updateProduct(this.productObj);
        this.resetForm();
      }
    } else {
      // Add new product
      if (this.selectedFile) {
        const filePath = `product_images/${Date.now()}_${
          this.selectedFile.name
        }`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((imageUrl) => {
                this.productObj.product_image = imageUrl;
                if (this.isEditMode) {
                  this.data.updateProduct(this.productObj);
                } else {
                  this.data.addProduct(this.productObj);
                }
                this.resetForm();
                this.dialogRef.close();
                // this.data.addProduct(this.productObj);
                // this.resetForm();
              });
            })
          )
          .subscribe();
      } else {
        if (this.isEditMode) {
          this.data.updateProduct(this.productObj);
        } else {
          this.data.addProduct(this.productObj);
        }
        this.resetForm();
        this.dialogRef.close();
        // this.data.addProduct(this.productObj);
        // this.resetForm();
      }
    }
  }

  // update product
  // updateProduct() {
  //   // this.selectedProduct = { ...product };
  //   // this.id = this.selectedProduct.id;
  //   // this.product_name = this.selectedProduct.product_name;
  //   // this.product_category = this.selectedProduct.product_category.id;
  //   // this.product_description = this.selectedProduct.product_description;
  //   // this.product_price = this.selectedProduct.product_price;

  //   // if (
  //   //   this.product.product_name === '' ||
  //   //   this.product.product_description === '' ||
  //   //   this.product.product_category === '' ||
  //   //   this.product.product_price === 0
  //   // ) {
  //   //   alert('Fill all input fields');
  //   //   return;
  //   // }

  //   if (
  //     this.product_name == '' ||
  //     this.product_description == '' ||
  //     this.product_category == '' ||
  //     this.product_price == 0
  //   ) {
  //     alert('Fill all input fields');
  //     return;
  //   }

  //   this.productObj.product_name = this.product_name;
  //   this.productObj.product_description = this.product_description;

  //   const selectedCategory = this.categories.find(
  //     (category) => category.id === this.product_category
  //   );

  //   if (selectedCategory) {
  //     this.productObj.product_category = selectedCategory;
  //   } else {
  //     this.productObj.product_category = {
  //       id: '',
  //       category_name: '',
  //     };
  //   }

  //   this.productObj.product_price = this.product_price;

  //   if (this.selectedFile) {
  //     const filePath = `product_images/${Date.now()}_${this.selectedFile.name}`;
  //     const fileRef = this.storage.ref(filePath);
  //     const task = this.storage.upload(filePath, this.selectedFile);

  //     task
  //       .snapshotChanges()
  //       .pipe(
  //         finalize(() => {
  //           fileRef.getDownloadURL().subscribe((imageUrl) => {
  //             this.productObj.product_image = imageUrl;
  //             this.saveProduct();
  //           });
  //         })
  //       )
  //       .subscribe();
  //   } else {
  //     this.saveProduct();
  //   }
  // }

  // delete product
  deleteProduct(product: Products) {
    if (
      window.confirm(
        'Are you sure you want to delete ' + product.product_name + ' ?'
      )
    ) {
      this.data.deleteProduct(product);
    }
  }

  // ------------------

  saveProduct() {
    if (
      this.product_name === '' ||
      this.product_description === '' ||
      this.product_category === '' ||
      this.product_price === 0
    ) {
      alert('Fill all input fields');
      return;
    }
    this.productObj.product_name = this.product_name;
    this.productObj.product_description = this.product_description;
    const selectedCategory = this.categories.find(
      (category) => category.id === this.product_category
    );

    if (selectedCategory) {
      this.productObj.product_category = selectedCategory;
    } else {
      this.productObj.product_category = {
        id: '',
        category_name: '',
      };
    }

    this.productObj.product_price = this.product_price;

    if (this.selectedFile) {
      const filePath = `product_images/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((imageUrl) => {
              this.productObj.product_image = imageUrl;
              if (this.isEditMode) {
                this.data.updateProduct(this.productObj);
              } else {
                this.data.addProduct(this.productObj);
              }
              this.resetForm();
              this.dialogRef.close();
            });
          })
        )
        .subscribe();
    } else {
      if (this.isEditMode) {
        this.data.updateProduct(this.productObj);
      } else {
        this.data.addProduct(this.productObj);
      }
      this.resetForm();
      this.dialogRef.close();
    }
  }

  // ------------------

  // saveProduct() {
  //   // // Perform any necessary operations with the product data
  //   // console.log('Product:', this.product);

  //   // // Close the dialog and pass the product data back to the parent component
  //   // this.dialogRef.close(this.product);

  //   if (this.isEditMode) {
  //     this.data.updateProduct(this.productObj);
  //   } else {
  //     this.data.addProduct(this.productObj);
  //   }
  //   this.resetForm();
  //   this.dialogRef.close();
  // }

  closeDialog() {
    // Close the dialog without passing any data
    this.dialogRef.close();
  }
}
