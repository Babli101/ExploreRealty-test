import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { gsap } from 'gsap';
import { SubscribeService } from '../subscribe.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {

  searchResults: any[] = [];
  searched = false;
  latestProjects: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private subscribeService: SubscribeService
  ) { }

  ngOnInit() {
    this.fetchLatestProjects();
  }

  fetchLatestProjects() {
    this.subscribeService.getProjects().subscribe({
      next: (projects) => {
        this.latestProjects = projects.slice(0, 3);
        console.log("LATEST PROJECTS:", this.latestProjects);
      },
      error: (err) => console.error("Project fetch error:", err)
    });
  }

  getImageUrl(image: any): string {
    const baseUrl = 'https://explorerealty.onrender.com';  // FIXED

    if (!image) return 'assets/noimage.jpg';

    const path =
      typeof image === 'string'
        ? image
        : image.url || `/uploads/${image.filename}`;

    if (!path) return 'assets/noimage.jpg';

    // Already absolute URL
    if (path.startsWith('http')) return path;

    // Ensure correct joining
    return `${baseUrl}${path}`;
  }


  allProperties = [
    { city: 'Delhi', type: 'Buy', price: 120000 },
    { city: 'Delhi', type: 'Rent', price: 40000 },
    { city: 'Mumbai', type: 'Commercial', price: 250000 },
    { city: 'Mumbai', type: 'Buy', price: 200000 },
  ];

  searchProperties(form: NgForm) {
    this.searched = true;

    const { city, listingType, minPrice, maxPrice } = form.value;
    const min = +minPrice || 0;
    const max = +maxPrice || Number.MAX_SAFE_INTEGER;

    this.searchResults = this.allProperties.filter((property) => {
      return (
        (!city || property.city === city) &&
        (!listingType || property.type === listingType) &&
        property.price >= min &&
        property.price <= max
      );
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateLines();
    }
  }

  private animateLines() {
    if (!isPlatformBrowser(this.platformId)) return;

    const lines = document.querySelectorAll<HTMLElement>('.line');
    if (!lines.length) return;

    const tl = gsap.timeline({ repeat: -1 });
    const time = 0.9;
    const y = 100;

    tl.fromTo(
      lines,
      { opacity: 0, y: y },
      { opacity: 1, y: 0, duration: time, stagger: 2, ease: 'circ.inOut' }
    );

    tl.to(
      lines,
      { opacity: 0, y: -y, duration: time, stagger: 2, ease: 'circ.inOut', delay: time },
      1.3
    );
  }
}
