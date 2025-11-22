import { Component, AfterViewInit, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscribeService } from '../subscribe.service';
import { environment } from '../../environments/environment';
import { gsap } from 'gsap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-single-project',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './single-project.html',
  styleUrls: ['./single-project.scss']
})
export class SingleProjectComponent implements OnInit, AfterViewInit {
 project: any;
 environment = environment;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private subscribeService: SubscribeService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.subscribeService.getProjectById(projectId).subscribe({
        next: project => {
          console.log('API response:', project);
          this.project = project; // directly assign, no data.success or data.project
        },
        error: err => console.error('Failed to load project', err)
      });
    }
  }


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) this.animateLines();
  }

  private animateLines() {
    const lines = document.querySelectorAll<HTMLElement>('.line');
    if (!lines.length) return;

    const tl = gsap.timeline({ repeat: -1 });
    const time = 0.9;
    const y = 100;

    tl.fromTo(lines, { opacity: 0, y }, { opacity: 1, y: 0, duration: time, stagger: 2, ease: 'circ.inOut' });
    tl.to(lines, { opacity: 0, y: -y, duration: time, stagger: 2, ease: 'circ.inOut', delay: time }, 1.3);
  }

  getSafeMap(url: string | undefined): SafeResourceUrl | null {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }

  // ✅ Brochure download handler
  // downloadBrochure(brochureUrl: string | undefined) {
  //   if (!brochureUrl) {
  //     alert('No brochure available for this project.');
  //     return;
  //   }
  //   const link = document.createElement('a');
  //   link.href = brochureUrl;
  //   link.download = brochureUrl.split('/').pop() || 'brochure.pdf';
  //   link.target = '_blank';
  //   link.click();
  // }

  getImageUrl(image: any): string {
    const baseUrl = environment.apiBaseUrl?.replace(/\/api$/, '') || 'http://localhost:3000';
    const path = typeof image === 'string' ? image : image?.url || image?.filename;

    if (!path) return 'assets/noimage.jpg';
    if (path.startsWith('http')) return path;

    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

 downloadBrochure(file: string | { url?: string; filename?: string } | undefined) {
  if (!file) {
    alert('No brochure available for this project.');
    return;
  }

  // Determine the actual URL and filename
  let brochureUrl: string;
  let fileName: string;

  if (typeof file === 'string') {
    brochureUrl = file;
    fileName = file.split('/').pop() || 'brochure.pdf';
  } else {
    brochureUrl = file.url || '';
    fileName = file.filename || 'brochure.pdf';
  }

  if (!brochureUrl) {
    alert('Brochure URL not available.');
    return;
  }

  // Prepend base URL if it's a relative path
  const baseUrl = environment.apiBaseUrl?.replace(/\/api$/, '') || 'http://localhost:3000';
  if (!brochureUrl.startsWith('http')) {
    brochureUrl = `${baseUrl}${brochureUrl.startsWith('/') ? '' : '/'}${brochureUrl}`;
  }

  const link = document.createElement('a');
  link.href = brochureUrl;
  link.download = fileName;
  link.target = '_blank';
  link.click();
}

  
  get connectivityPoints(): string[] {
  if (!this.project?.location) return [];
  return [
    this.project.location.location1,
    this.project.location.location2,
    this.project.location.location3,
    this.project.location.location4,
    this.project.location.location5
  ].filter(Boolean); // remove undefined/null
}


}
