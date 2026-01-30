import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubscribeService, Property } from '../subscribe.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-single-proprty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-property.html',
  styleUrls: ['./single-property.scss']
})
export class SinglePropertyComponent implements OnInit, OnDestroy {

  property!: Property;
  environment = environment;

  // slider
  currentIndex = 0;
  intervalId: any;
  images: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private subscribeService: SubscribeService
  ) {}

  ngOnInit() {
    const propertyId = this.route.snapshot.paramMap.get('id');

    if (propertyId) {
      this.subscribeService.getPropertyById(propertyId).subscribe({
        next: (property: Property) => {
          this.property = property;

          // ✅ gallery -> images
          this.images = property.gallery?.length
            ? property.gallery
                .map(img =>
                  img.url
                    ? this.environment.apiBaseUrl + img.url
                    : null
                )
                .filter((url): url is string => !!url)
            : [
                'img/ats-1.jpg',
                'img/ats-1.jpg',
                'img/ats-1.jpg',
              ];

          this.startAutoSlide();
        },
        error: (err) => console.error('Failed to load property', err)
      });
    }
  }

  startAutoSlide() {
    if (this.images.length > 1) {
      this.intervalId = setInterval(() => {
        this.next();
      }, 3000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
