import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
// import { AdminRoutingModule } from './admin-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ToastrModule } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';

import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
// import { HomeComponent } from './components/user/home/home.component';
// import { NavbarComponent } from './components/user/navbar/navbar.component';
// import { FooterComponent } from './components/user/footer/footer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ProductComponent } from './components/admin/dashboard/product/product.component';
// import { CategoryComponent } from './components/admin/dashboard/category/category.component';
// import { ProductDetailComponent } from './components/user/product-detail/product-detail.component';
// import { CartComponent } from './components/user/cart/cart.component';
// import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { SidenavComponent } from './components/admin/dashboard/sidenav/sidenav.component';
import { UserComponent } from './components/user/user.component';
import { OrdersComponent } from './components/admin/dashboard/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(appRoutes),
    MDBBootstrapModule.forRoot(),
    UserModule,
    AdminModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
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
    MatDialogModule,
    MDBBootstrapModule,
    RouterModule,
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent],
})
export class AppModule {}
