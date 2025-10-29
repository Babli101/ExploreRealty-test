import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent {
 isMenuOpen = false;

toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
}
}