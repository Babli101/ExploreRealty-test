import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubscribeService } from '../subscribe.service'; 

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  subscribeForm!: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private SubscribeService:SubscribeService) {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubscribe(): void {
    if (this.subscribeForm.invalid) {
      this.message = 'Please enter a valid email address.';
      return;
    }

    const emailValue = this.subscribeForm.value.email;

    this.SubscribeService.subscribe(emailValue).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.subscribeForm.reset();
      },
      error: (err) => {
        this.message = err.error.error || 'Something went wrong!';
      }
    });
  }

  // ✅ Getter for form controls
  get f() {
    return this.subscribeForm.controls;
  }
}
