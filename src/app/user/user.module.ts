import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModule,
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
import { MatTableDataSource } from '@angular/material/table';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFireMessagingModule } from '@angular/fire/messaging';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { environment } from 'src/environments/environment';

import { HomeComponent } from '../components/user/home/home.component';
import { ProductDetailComponent } from '../components/user/product-detail/product-detail.component';
import { CheckoutComponent } from '../components/user/checkout/checkout.component';
import { NavbarComponent } from '../components/user/navbar/navbar.component';
import { FooterComponent } from '../components/user/footer/footer.component';
import { UserComponent } from '../components/user/user.component';
import { CartComponent } from '../components/user/cart/cart.component';
import { AboutUsComponent } from '../components/user/about-us/about-us.component';
import { ContactUsComponent } from '../components/user/contact-us/contact-us.component';
import { UserProfileComponent } from '../components/user/user-profile/user-profile.component';
import { PaymentComponent } from '../components/user/payment/payment.component';
import { UserOrdersComponent } from '../components/user/user-orders/user-orders.component';
import { ProductsComponent } from '../components/user/products/products.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'product-detail/:id', component: ProductDetailComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'checkout/:id', component: CheckoutComponent },
      { path: 'cart', component: CartComponent },
      { path: 'about', component: AboutUsComponent },
      { path: 'contact', component: ContactUsComponent },
      { path: 'profile/:id', component: UserProfileComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'payment/:id', component: PaymentComponent },
      { path: 'orders/:id', component: UserOrdersComponent },
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
    AboutUsComponent,
    ContactUsComponent,
    UserProfileComponent,
    PaymentComponent,
    UserOrdersComponent,
    ProductsComponent,
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
    NgbModule,
    MatTableModule,
    // MatTableDataSource,
    MatDialogModule,
    // MatTableDataSource,
    MDBBootstrapModule,
  ],
})
export class UserModule {}
