// admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { AdminNavbarComponent } from './admin-navbar.component'; 
import { Midnav } from './midnav';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet,AdminNavbarComponent,Midnav],
  template: `
    <div class="admin-wrapper">
  <!-- Sidebar or Top Navbar -->
  <app-admin-navbar></app-admin-navbar>
  <app-midnav></app-midnav>


  <!-- Main content -->
  <div class="admin-content">
    <router-outlet></router-outlet>
  </div>
</div>

  `
})
export class AdminComponent {}
