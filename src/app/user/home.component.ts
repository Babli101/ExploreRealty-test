import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { gsap } from 'gsap';
import { SubscribeService } from '../subscribe.service';
import { AdminService } from '../admin.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

// Swiper imports
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

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
  latestProperty: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private subscribeService: SubscribeService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.fetchLatestProjects();
    this.fetchLatestProperty();
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


  fetchLatestProperty() {
    this.adminService.getAllProperties().subscribe({
      next: (properties: any[]) => {
        this.latestProperty = properties.slice(0, 3);
      },
      error: (err) => console.error('Property fetch error:', err)
    });
  }

  getImage(item: any, index: number = 0) {
    const baseUrl = environment.publicBaseUrl.replace(/\/$/, '');

    if (!item?.gallery?.length) return 'assets/noimage.jpg';

    const img = item.gallery[index];

    // CASE 1: Object { url }
    if (typeof img === 'object' && img?.url) {
      if (img.url.startsWith('http')) return img.url;
      return `${baseUrl}${img.url}`;
    }

    // CASE 2: Direct string "/uploads/xxx.jpg"
    if (typeof img === 'string') {
      if (img.startsWith('http')) return img;
      return `${baseUrl}${img}`;
    }

    return 'assets/noimage.jpg';
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

  // ====================content changer start=============================
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
  // ====================content changer end=============================


  // 🔥 SINGLE ngAfterViewInit (no duplication)
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateLines();
      this.initSwiper();
    }
  }

  // Swiper init
  private initSwiper() {
    if (!isPlatformBrowser(this.platformId)) return;

    new Swiper('.mySwiper', {
      modules: [Autoplay, Pagination],
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}
