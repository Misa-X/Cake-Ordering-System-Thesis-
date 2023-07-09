import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { __importDefault } from 'tslib';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Category } from 'src/app/models/category';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'category',
    'price',
    'action',
  ];

  productList: Products[] = [];
  categories: Category[] = [];

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
    private dialog: MatDialog,
    private data: DataService,
    private storage: AngularFireStorage
  ) {}

  dataSource!: MatTableDataSource<Products>;

  ngOnInit(): void {
    this.getAllProducts();
  }

  resetForm() {
    this.id = '';
    this.product_name = '';
    this.product_category = '';
    this.product_description = '';
    this.product_image = '';
    this.product_price = 0;
  }

  getAllProducts() {
    this.data.getAllProducts().subscribe(
      (res) => {
        this.productList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
        this.dataSource = new MatTableDataSource(this.productList);
      },
      (err: any) => {
        alert('Error while fetching product data');
      }
    );
  }

  // editProduct(product: Products) {
  //   // Implement your logic for editing the product
  //   console.log('Edit product:', product);
  // }

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
                this.data.addProduct(this.productObj);
                this.resetForm();
              });
            })
          )
          .subscribe();
      } else {
        this.data.addProduct(this.productObj);
        this.resetForm();
      }
    }
  }

  // update product
  updateProduct(product: Products) {
    this.selectedProduct = { ...product };
    this.id = this.selectedProduct.id;
    this.product_name = this.selectedProduct.product_name;
    this.product_category = this.selectedProduct.product_category.id;
    this.product_description = this.selectedProduct.product_description;
    this.product_price = this.selectedProduct.product_price;
  }

  deleteProduct(product: Products) {
    if (
      window.confirm(
        'Are you sure you want to delete ' + product.product_name + ' ?'
      )
    ) {
      this.data.deleteProduct(product);
    }
  }

  openAddProduct() {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '400px', // Adjust the width as per your requirements
      // You can also specify other dialog configuration options here
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any actions after the dialog is closed
      console.log('Dialog closed', result);
    });
  }

  openEditProduct(product: Products | null) {
    console.log('Product Print: ', product);
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '400px', // Adjust the width as per your requirements
      data: product, // Pass the selected product data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProduct(result); // Handle the updated product data
      }
    });
  }

  editProduct(product: Products) {
    this.openEditProduct(product); // Open the dialog in edit mode
  }
}
