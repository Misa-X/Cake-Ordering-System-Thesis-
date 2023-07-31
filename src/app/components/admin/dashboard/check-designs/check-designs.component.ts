import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-check-designs',
  templateUrl: './check-designs.component.html',
  styleUrls: ['./check-designs.component.css'],
})
export class CheckDesignsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataD: any) {}

  ngOnInit() {}
}
