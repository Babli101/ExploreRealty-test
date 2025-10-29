import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    // Element references after view is initialized
  }

  onSignUp() {
    this.containerRef.nativeElement.classList.add('right-panel-active');
    console.log('Sign Up button clicked - adding class');
  }

  onSignIn() {
    this.containerRef.nativeElement.classList.remove('right-panel-active');
    console.log('Sign In button clicked - removing class');
  }
}
