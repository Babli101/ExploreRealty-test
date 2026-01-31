import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscribeService } from '../subscribe.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/* ✅ MUST be outside class */
declare var google: any;

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

  // 🔒 Google login state
  googleInitialized = false;
  googleRequestInProgress = false;

  constructor(
    private subscribeService: SubscribeService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* ================= UI TOGGLES ================= */
  onSignUp() {
    this.isSignUp = true;
  }

  onSignIn() {
    this.isSignUp = false;
  }

  /* ================= RESPONSIVE ================= */
  get isMobile(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {}

  /* ================= SIGNUP ================= */
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

  /* ================= NORMAL LOGIN ================= */
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

  /* ================= GOOGLE LOGIN (FIXED) ================= */
  loginWithGoogle() {
    if (!isPlatformBrowser(this.platformId)) return;

    // 🔒 Prevent multiple requests
    if (this.googleRequestInProgress) return;

    // ✅ Initialize only once
    if (!this.googleInitialized) {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          this.googleRequestInProgress = false;
          this.sendTokenToBackend(response.credential);
        }
      });
      this.googleInitialized = true;
    }

    this.googleRequestInProgress = true;
    google.accounts.id.prompt(); // 🔥 Google popup
  }

  /* ================= SEND TOKEN TO BACKEND ================= */
  sendTokenToBackend(token: string) {
    this.http.post(`${environment.apiBaseUrl}/auth/google`, { token })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role || 'user');
          this.router.navigate(['/']);
        },
        error: () => {
          this.googleRequestInProgress = false;
          alert('Google login failed');
        }
      });
  }
}
