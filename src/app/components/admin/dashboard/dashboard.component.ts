import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  /*

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
    // this.productObj.product_image = this.product_image;
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

    // this.data.addProduct(this.productObj);
    // this.resetForm();
  }



  */
}
