import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ToastrModule } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';

import { HomeComponent } from '../components/user/home/home.component';
import { ProductDetailComponent } from '../components/user/product-detail/product-detail.component';
import { CheckoutComponent } from '../components/user/checkout/checkout.component';
import { NavbarComponent } from '../components/user/navbar/navbar.component';
import { FooterComponent } from '../components/user/footer/footer.component';
import { UserComponent } from '../components/user/user.component';
import { CartComponent } from '../components/user/cart/cart.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'product-detail/:id', component: ProductDetailComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'cart', component: CartComponent },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ProductDetailComponent,
    CheckoutComponent,
    NavbarComponent,
    FooterComponent,
    UserComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatDialogModule,
    MDBBootstrapModule,
  ],
})
export class UserModule {}
