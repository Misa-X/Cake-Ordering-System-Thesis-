import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css'],
})
export class ManageAdminComponent implements OnInit {
  displayedColumns: string[] = ['first', 'last', 'email'];

  constructor() {}

  ngOnInit() {}
}
