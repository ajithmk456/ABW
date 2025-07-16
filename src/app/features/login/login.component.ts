import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mobileNumber: string = '';
  rememberMe: boolean = false;

  users = [
    { name: 'Ajith', mobile: '8124440456'},
    { name: 'Rajan', mobile: '9363269771'},
    { name: 'Nagaraj', mobile: '8015333008'}
  ];

  constructor(private router: Router) {}

  login() {
    const user = this.users.find(u => u.mobile === this.mobileNumber.trim());

    if (user) {
      alert(`Welcome ${user.name}`);
      
      // Optional: store login session
      if (this.rememberMe) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
      }

      // Redirect to quotation
      this.router.navigate(['/dashboard']);
    } else {
      alert('Login failed. Mobile number not recognized.');
    }
  }
}
