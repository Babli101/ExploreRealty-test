import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { gsap } from 'gsap';
// Swiper imports
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements AfterViewInit, OnInit {

slides = [
  {
    image: '/img/apartment.jpg',
    caption: 'Luxury Apartments',
    animation: 'fadeIn'
  },
  {
    image: '/img/mall.jpg',
    caption: 'Modern Commercial Spaces',
    animation: 'fadeIn'
  },
  {
    image: '/img/villa.jpg',
    caption: 'Premium Villas & Plots',
    animation: 'fadeIn'
  }
];
  currentIndex = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

 ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      }, 4000);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Animate lines
    this.animateLines();

    // Initialize Swiper for Agents slider
    new Swiper('.myAgentsSwiper', {
      modules: [Autoplay, Pagination],
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
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
}
