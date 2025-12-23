import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-property.html',
  styleUrls: ['./add-property.scss']
})
export class AddPropertyComponent {

  addPropertyForm: FormGroup;
  isSubmitting = false;
  selectedImages: File[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.addPropertyForm = this.fb.group({
      placeName: ['', Validators.required],
      price: ['', Validators.required],
      size: ['', Validators.required],

      saleType: this.fb.array([], Validators.required),
      propertyType: this.fb.array([], Validators.required),
      propertyCategory: this.fb.array([], Validators.required),
      furnishing: this.fb.array([]),
      bhkType: this.fb.array([]),
      status: this.fb.array([]),

      floor: [''],
      address: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  // ================= FILE SELECT =================
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  // ================= FORM ARRAY =================
  getArray(name: string): FormArray {
    return this.addPropertyForm.get(name) as FormArray;
  }

  onCheckboxChange(event: Event, controlName: string) {
    const checkbox = event.target as HTMLInputElement;
    const formArray = this.getArray(controlName);

    if (checkbox.checked) {
      formArray.push(new FormControl(checkbox.value));
    } else {
      const index = formArray.controls.findIndex(
        x => x.value === checkbox.value
      );
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  // ================= SUBMIT =================
  submitForm() {
    if (this.addPropertyForm.invalid) {
      this.addPropertyForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const v = this.addPropertyForm.value;

    // 🔥 BASIC FIELDS
    formData.append('placeName', v.placeName);
    formData.append('price', String(v.price));
    formData.append('size', String(v.size));
    formData.append('address', v.address);
    formData.append('description', v.description);

    if (v.floor) {
      formData.append('floor', String(v.floor));
    }

    // 🔥 ARRAY FIELDS
    const arrayFields = [
      'saleType',
      'propertyType',
      'propertyCategory',
      'furnishing',
      'bhkType',
      'status'
    ];

    arrayFields.forEach(field => {
      if (Array.isArray(v[field])) {
        v[field].forEach((value: string) => {
          formData.append(field, value);
        });
      }
    });

    // 🔥 IMAGE FILES
    this.selectedImages.forEach(file => {
      formData.append('gallery', file);
    });

    this.isSubmitting = true;

    this.adminService.addProperty(formData).subscribe({
      next: () => {
        alert('Property added successfully ✅');
        this.addPropertyForm.reset();
        this.selectedImages = [];
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('ADD PROPERTY ERROR:', err);
        alert('Failed to add property ❌');
        this.isSubmitting = false;
      }
    });
  }
}
