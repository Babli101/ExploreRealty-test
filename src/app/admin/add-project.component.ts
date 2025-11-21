import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubscribeService } from '../subscribe.service';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  addProjectForm: FormGroup;
  selectedGallery: File[] = [];
  selectedBrochure?: File;
  selectedCategory: string = '';

  constructor(
    private fb: FormBuilder,
    private subscribeService: SubscribeService
  ) {
    this.addProjectForm = this.fb.group({
      name: ['', Validators.required],
      developer: ['', Validators.required],
      rera: ['', Validators.required],
      size: ['', Validators.required],
      description: ['', Validators.required],
      highlight: ['', Validators.required],
      possession: [''],
      price1bhk: [''],
      price2bhk: [''],
      price3bhk: [''],
      price4bhk: [''],
      retailPrice: [''],
      officePrice: [''],
      category: ['', Validators.required],
      status: ['', Validators.required],
      location: ['', Validators.required],
      location1: [''],
      location2: [''],
      location3: [''],
      location4: [''],
      location5: [''],
      mapEmbed: ['']
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;

    if (this.selectedCategory === 'residential') {
      this.addProjectForm.patchValue({
        retailPrice: '',
        officePrice: ''
      });
    } else if (this.selectedCategory === 'commercial') {
      this.addProjectForm.patchValue({
        price1bhk: '',
        price2bhk: '',
        price3bhk: '',
        price4bhk: ''
      });
    }
  }

  onGalleryChange(event: any) {
    this.selectedGallery = Array.from(event.target.files);
  }

  onBrochureChange(event: any) {
    this.selectedBrochure = event.target.files[0];
  }

  onSubmit() {
    if (this.addProjectForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    const data = this.addProjectForm.value;

    // Append normal fields
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);  // NO JSON.stringify
      }
    }

    // Append files
    this.selectedGallery.forEach(file => formData.append('gallery', file));
    if (this.selectedBrochure) {
      formData.append('brochure', this.selectedBrochure);
    }

    this.subscribeService.postProject(formData).subscribe({
      next: () => {
        alert('✅ Project added successfully!');
        this.addProjectForm.reset();
        this.selectedGallery = [];
        this.selectedBrochure = undefined;
        this.selectedCategory = '';
      },
      error: err => {
        console.error('Error adding project:', err);
        alert('❌ Failed to add project. Check console for details.');
      }
    });
  }
}
