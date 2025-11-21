import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscribeService } from '../subscribe.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLDivElement>;

  signupData = { name: '', email: '', password: '' };
  loginData = { email: '', password: '' };

  constructor(private subscribeService: SubscribeService, private router: Router) { }

  ngAfterViewInit() { }

  // Animation toggle
  onSignUp() {
    this.mainContainer.nativeElement.classList.add('right-panel-active');
  }

  onSignIn() {
    this.mainContainer.nativeElement.classList.remove('right-panel-active');
  }

  // SIGNUP
  onSignupSubmit() {
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password) {
      alert('Please fill all fields.');
      return;
    }

    this.subscribeService.signup(this.signupData).subscribe({
      next: () => {
        alert('Account created! Please login.');
        this.signupData = { name: '', email: '', password: '' };
        this.onSignIn();
      },
      error: (err) => {
        console.error('Signup error:', err);
        alert('Signup failed.');
      }
    });
  }

  // LOGIN
  onLoginSubmit() {
    this.subscribeService.login(this.loginData).subscribe({
      next: (res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
        }

        console.log('ROLE FROM SERVER:', res.role);

        const userRole = res.role?.toLowerCase().trim();

        setTimeout(() => {
          if (userRole === 'admin') {
            this.router.navigate(['/admin/get-project']);
          } else {
            this.router.navigate(['/']);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
}
