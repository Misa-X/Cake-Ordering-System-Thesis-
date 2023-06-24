import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/admin/dashboard/category/category.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { SidenavComponent } from './components/admin/dashboard/sidenav/sidenav.component';
import { ProductComponent } from './components/admin/dashboard/product/product.component';
import { CartComponent } from './components/user/cart/cart.component';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/user/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailComponent } from './components/user/product-detail/product-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UserModule } from './user/user.module';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  {
    path: '',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },

  // { path: 'products', component: ProductComponent },
  // { path: 'categories', component: CategoryComponent },
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'sidenav', component: SidenavComponent },
  // { path: 'product-detail/:id', component: ProductDetailComponent },
  // { path: 'product-detail', component: ProductDetailComponent },
  // { path: 'cart', component: CartComponent },
  // { path: 'checkout', component: CheckoutComponent },
  // { path: 'checkout/:id', component: CheckoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
