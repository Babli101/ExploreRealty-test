import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubscribeService, Property } from '../subscribe.service';
import { environment } from '../../environments/environment';

/* ✅ TYPE MUST BE OUTSIDE CLASS */
type GalleryItem = string | { url: string };

@Component({
  selector: 'app-single-proprty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-property.html',
  styleUrls: ['./single-property.scss']
})
export class SinglePropertyComponent implements OnInit, OnDestroy {

  property!: Property;

  // slider
  images: string[] = [];
  currentIndex = 0;
  intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private subscribeService: SubscribeService
  ) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (!propertyId) return;

    this.subscribeService.getPropertyById(propertyId).subscribe({
      next: (property: Property) => {
        console.log('SINGLE PROPERTY DATA:', property);

        this.property = property;
        this.images = this.resolveImages(property);
        this.startAutoSlide();
      },
      error: (err) => console.error('Failed to load property', err)
    });
  }

  /* ================= IMAGE RESOLVER ================= */
  resolveImages(property: any): string[] {
    const baseUrl = environment.publicBaseUrl.replace(/\/$/, '');

    if (!property?.gallery) {
      return ['assets/noimage.jpg'];
    }

    // CASE 1: gallery is string
    if (typeof property.gallery === 'string') {
      return [
        property.gallery.startsWith('http')
          ? property.gallery
          : `${baseUrl}${property.gallery}`
      ];
    }

    // CASE 2: gallery is object { url }
    if (
      typeof property.gallery === 'object' &&
      !Array.isArray(property.gallery) &&
      'url' in property.gallery
    ) {
      const imgObj = property.gallery as { url: string };
      return [
        imgObj.url.startsWith('http')
          ? imgObj.url
          : `${baseUrl}${imgObj.url}`
      ];
    }

    // CASE 3: gallery is array
    if (Array.isArray(property.gallery)) {
      const imgs = (property.gallery as GalleryItem[])
        .map((img: GalleryItem): string | null => {
          if (typeof img === 'string') {
            return img.startsWith('http') ? img : `${baseUrl}${img}`;
          }

          if (typeof img === 'object' && 'url' in img) {
            return img.url.startsWith('http')
              ? img.url
              : `${baseUrl}${img.url}`;
          }

          return null;
        })
        .filter((img): img is string => img !== null);

      return imgs.length ? imgs : ['assets/noimage.jpg'];
    }

    return ['assets/noimage.jpg'];
  }

  /* ================= VALUE FORMATTER ================= */
  // 🔥 ARRAY → string, empty → —
  getValue(value: any): string {
    if (Array.isArray(value)) {
      return value.length ? value.join(', ') : '—';
    }
    return value ?? '—';
  }

  /* ================= SLIDER ================= */
  startAutoSlide() {
    if (this.images.length <= 1) return;

    this.intervalId = setInterval(() => {
      this.next();
    }, 3000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
