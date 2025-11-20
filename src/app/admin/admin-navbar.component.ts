import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent {
  constructor(private router: Router, private auth: AuthService) {} 
// ✅ Logout
  logout() {
    this.auth.logout(); // 👈 Centralized logout
    this.router.navigate(['/login']);
  }
}