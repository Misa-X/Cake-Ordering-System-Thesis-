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

import { SidenavComponent } from '../components/admin/dashboard/sidenav/sidenav.component';
import { CategoryComponent } from '../components/admin/dashboard/category/category.component';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';
import { ProductComponent } from '../components/admin/dashboard/product/product.component';
import { OrdersComponent } from '../components/admin/dashboard/orders/orders.component';

const routes: Routes = [
  {
    path: 'dash',
    component: DashboardComponent,
    children: [
      { path: 'category', component: CategoryComponent },
      { path: 'product', component: ProductComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    SidenavComponent,
    CategoryComponent,
    ProductComponent,
    OrdersComponent,
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
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
  ],
})
export class AdminModule {}
