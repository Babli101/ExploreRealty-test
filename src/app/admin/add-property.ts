import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-property.html',
  styleUrls: ['./add-property.scss']
})
export class AddPropertyComponent {

  addPropertyForm: FormGroup;
  selectedImages: File[] = [];

  constructor(private fb: FormBuilder) {
    this.addPropertyForm = this.fb.group({
      placeName: ['', Validators.required],
      price: ['', Validators.required],
      propertyType: this.fb.array([]),        // Residential / Commercial
      propertyCategory: this.fb.array([]),    // Plot / Flat / Shop / House
      furnishing: this.fb.array([]),          // Furnished / Semi / Unfurnished
      bhkType: this.fb.array([]),             // 1BHK / 2BHK / 3BHK / Studio
      floor: [''],
      address: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // Checkbox Handler
  onCheckboxChange(event: any, formArrayName: string) {
    const formArray: FormArray = this.addPropertyForm.get(formArrayName) as FormArray;

    if (event.target.checked) {
      formArray.push(this.fb.control(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      formArray.removeAt(index);
    }
  }

  // Multiple Images
  onImagesChange(event: any) {
    this.selectedImages = Array.from(event.target.files);
  }

  // Submit
  onSubmit() {
    if (this.addPropertyForm.invalid) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    const data = this.addPropertyForm.value;

    // Add form values
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key].forEach((val: any) => formData.append(key, val)); // multiple values
      } else {
        formData.append(key, data[key]);
      }
    });

    // Add images
    this.selectedImages.forEach(file => formData.append('images', file));

    console.log("Property Form Data:", data);
    alert("Property Added Successfully!");
  }
}
