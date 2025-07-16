import { Component, NgZone } from '@angular/core';
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


constructor(private router: Router) {

    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('rememberMe'); // if you're using this too

}

login() {
  const user = this.users.find(u => u.mobile === this.mobileNumber.trim());

  if (user) {

    //  Always store for AuthGuard to recognize login
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    this.router.navigate(['/dashboard']);
  } else {
    alert('Login failed. Mobile number not recognized.');
  }
}


}
