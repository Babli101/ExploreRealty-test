import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { gsap } from 'gsap';
import { SubscribeService } from '../subscribe.service';
import { RouterModule } from '@angular/router';

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
  latestProjects: any[] = []; // ⭐ Add this

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private subscribeService: SubscribeService   // ⭐ Service injected
  ) {}

  ngOnInit() {
    this.fetchLatestProjects();   // ⭐ Fetch 3 projects on load
  }

  // ⭐ Fetch 3 Latest Projects
  fetchLatestProjects() {
    this.subscribeService.getProjects().subscribe({
      next: (projects) => {
        this.latestProjects = projects.slice(0, 3); // First 3 projects only
        console.log("LATEST PROJECTS:", this.latestProjects);
      },
      error: (err) => console.error("Project fetch error:", err)
    });
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
      { opacity: 1, y: 0, duration: time, stagger: 2, ease: "circ.inOut" }
    );

    tl.to(
      lines,
      { opacity: 0, y: -y, duration: time, stagger: 2, ease: "circ.inOut", delay: time },
      1.3
    );
  }
}
