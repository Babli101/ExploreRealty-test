import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  // Check if token exists
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Save token + role
  login(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get role
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
  }

} // <-- Make sure this is the last line, no extra braces
