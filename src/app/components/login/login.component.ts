import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hideNavbar: EventEmitter<boolean> = new EventEmitter<boolean>();

  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.hideNavbar.emit(true);
  }

  login() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.login(this.email, this.password);
    this.email = '';
    this.password = '';
  }

  signInWithGoogle() {
    this.auth.googleSignIn();
  }
}
