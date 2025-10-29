import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { SubscribeService } from '../subscribe.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
}) 
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private subscribeService: SubscribeService) {
    this.contactForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      message: new FormControl('', Validators.required)
    });
  }

  submitContactForm(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      this.subscribeService.submitContact(this.contactForm.value).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.contactForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          alert(err.error.error || 'Something went wrong!');
        }
      });
    }
  }
  get f() {
    return this.contactForm.controls;
  }
}