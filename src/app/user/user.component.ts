// user-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserNavbarComponent } from './user-navbar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet, UserNavbarComponent],
  template: `
    <app-user-navbar></app-user-navbar>
    <router-outlet></router-outlet>
  `
})
export class UserComponent {}
