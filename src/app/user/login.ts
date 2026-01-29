import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscribeService } from '../subscribe.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {

  isSignUp = false;

  signupData = { name: '', email: '', password: '' };
  loginData = { email: '', password: '' };

  constructor(
    private subscribeService: SubscribeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ---------- UI TOGGLES ----------
  onSignUp() {
    this.isSignUp = true;
  }

  onSignIn() {
    this.isSignUp = false;
  }

  // ---------- RESPONSIVE (SSR SAFE) ----------
  get isMobile(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return window.innerWidth < 768;
  }

  // Optional: re-evaluate on resize
  @HostListener('window:resize')
  onResize() {
    // getter auto re-evaluates
  }

  // ---------- SIGNUP ----------
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
      error: () => alert('Signup failed'),
    });
  }

  // ---------- LOGIN ----------
  onLoginSubmit() {
    this.subscribeService.login(this.loginData).subscribe({
      next: (res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
        }

        const role = res.role?.toLowerCase()?.trim();
        setTimeout(() => {
          role === 'admin'
            ? this.router.navigate(['/admin/get-project'])
            : this.router.navigate(['/']);
        }, 100);
      },
      error: () => alert('Login failed'),
    });
  }
}
