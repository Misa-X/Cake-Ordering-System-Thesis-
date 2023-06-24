import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {
  product: any = {};

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  saveProduct() {
    // Perform any necessary operations with the product data
    console.log('Product:', this.product);

    // Close the dialog and pass the product data back to the parent component
    this.dialogRef.close(this.product);
  }

  closeDialog() {
    // Close the dialog without passing any data
    this.dialogRef.close();
  }
}
