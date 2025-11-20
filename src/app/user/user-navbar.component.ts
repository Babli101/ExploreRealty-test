import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;

  constructor(private router: Router, private auth: AuthService) {} // 👈 Inject AuthService

  ngOnInit() {
    // ✅ Subscribe to login status changes
    this.auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // ✅ Initial check (in case page reload hua ho)
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  // ✅ Toggle for mobile view
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // ✅ Logout
  logout() {
    this.auth.logout(); // 👈 Centralized logout
    this.router.navigate(['/login']);
  }
}
