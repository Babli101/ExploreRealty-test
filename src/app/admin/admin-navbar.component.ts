import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent {
  constructor(private router: Router, private auth: AuthService) {} 
  // Mobile menu state
  isMenuOpen: boolean = false;

  // Toggle function
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

// ✅ Logout
  logout() {
    this.auth.logout(); // 👈 Centralized logout
    this.router.navigate(['/login']);
  }
}