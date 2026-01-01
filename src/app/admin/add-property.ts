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

      /* ---------- BASIC DETAILS ---------- */
      placeName: ['', Validators.required],
      price: ['', Validators.required],
      bprice: [''],
      size: ['', Validators.required],

      owner: [''],
      phone: ['', Validators.pattern(/^[6-9]\d{9}$/)],
      age: [''],
      floor: [''],
      address: ['', Validators.required],
      description: ['', Validators.required],

      /* ---------- CHECKBOX ARRAYS ---------- */
      saleType: this.fb.array([]),
      transactionType: this.fb.array([]),
      propertyType: this.fb.array([]),
      propertyCategory: this.fb.array([]),
      furnishing: this.fb.array([]),
      bhkType: this.fb.array([]),
      status: this.fb.array([])
    });
  }

  // ================= FILE SELECT =================
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  // ================= FORM ARRAY HELPER =================
  getArray(name: string): FormArray {
    return this.addPropertyForm.get(name) as FormArray;
  }

  onCheckboxChange(event: Event, controlName: string) {
    const checkbox = event.target as HTMLInputElement;
    const formArray = this.getArray(controlName);

    if (checkbox.checked) {
      if (!formArray.value.includes(checkbox.value)) {
        formArray.push(new FormControl(checkbox.value));
      }
    } else {
      const index = formArray.controls.findIndex(
        c => c.value === checkbox.value
      );
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  // ================= SUBMIT =================
  submitForm() {

      console.log('FORM VALUE 👉', this.addPropertyForm.value);
    if (
      this.getArray('saleType').length === 0 ||
      this.getArray('propertyType').length === 0 ||
      this.getArray('propertyCategory').length === 0
    ) {
      alert('Please select Sale Type, Property Type and Property Category');
      return;
    }

    if (this.addPropertyForm.invalid) {
      this.addPropertyForm.markAllAsTouched();
      return;
    }

    const v = this.addPropertyForm.value;
    const formData = new FormData();

    /* ---------- BASIC FIELDS ---------- */
    formData.append('placeName', v.placeName);
    formData.append('price', String(v.price));
    formData.append('size', String(v.size));
    formData.append('address', v.address);
    formData.append('description', v.description);

    if (v.bprice) formData.append('bprice', String(v.bprice));
    if (v.owner) formData.append('owner', v.owner);
    if (v.phone) formData.append('phone', v.phone);
    if (v.age) formData.append('age', v.age);
    if (v.floor) formData.append('floor', String(v.floor));

    /* ---------- ARRAY FIELDS ---------- */
    const arrayFields = [
      'saleType',
      'transactionType',
      'propertyType',
      'propertyCategory',
      'furnishing',
      'bhkType',
      'status'
    ];

    arrayFields.forEach(field => {
      v[field]?.forEach((value: string) => {
        formData.append(field, value);
      });
    });

    /* ---------- IMAGE FILES (SAFE) ---------- */
    if (this.selectedImages.length > 0) {
      this.selectedImages.forEach(file => {
        formData.append('gallery', file);
      });
    }

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
