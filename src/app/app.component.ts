import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  isNavbarHidden: boolean = false;

  constructor() {
    this.hideNavbarHandler = this.hideNavbarHandler.bind(this);
  }

  hideNavbarHandler(hide: boolean) {
    this.isNavbarHidden = hide;
  }
}
