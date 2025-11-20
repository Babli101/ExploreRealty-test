// src/app/subscribe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service'; // 👈 Added

// -----------------------------
// Project Interfaces
// -----------------------------
export interface GalleryItem {
  url?: string;
  filename: string;
}

export interface Project {
  _id?: string;
  name: string;
  category?: 'residential' | 'commercial';
  gallery?: GalleryItem[];
  brochure?: GalleryItem;
  price1bhk?: string;
  price2bhk?: string;
  price3bhk?: string;
  price4bhk?: string;
  retailPrice?: string;
  officePrice?: string;
  priceFrom?: string;
  developer?: string;
  rera?: string;
  size?: string;
  status?: 'trending' | 'upcoming' | 'newlyLaunched';
  description?: string;
  highlight?: string;
  location?: {
    main?: string;
    location1?: string;
    location2?: string;
    location3?: string;
    location4?: string;
    location5?: string;
    mapEmbed?: string;
  };
  possession?: string;
  createdAt?: string;
}

// -----------------------------
// Service
// -----------------------------
@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  private baseUrl = environment.apiBaseUrl;

  // API Endpoints
  private subscribeUrl = `${this.baseUrl}/subscribe`;
  private contactUrl = `${this.baseUrl}/contact`;
  private apiUrl = `${this.baseUrl}/projects`;
  private authUrl = `${this.baseUrl}/auth`; // ✅ for signup/login

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService // 👈 Injected AuthService
  ) {}

  // -----------------------------
  // 📩 Subscribe email
  // -----------------------------
  subscribe(email: string): Observable<any> {
    return this.http.post<any>(this.subscribeUrl, { email });
  }

  // -----------------------------
  // 📞 Submit contact form
  // -----------------------------
  submitContact(data: any): Observable<any> {
    return this.http.post<any>(this.contactUrl, data);
  }

  // -----------------------------
  // 👤 Signup API
  // -----------------------------
  signup(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, data);
  }

  // -----------------------------
  // 🔑 Login API
  // -----------------------------
  login(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res && res.token) {
          // ✅ Save to localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);

          // ✅ Notify AuthService → Navbar will auto-update
          this.auth.login(res.token);

          // ✅ Navigate by role
          if (res.role === 'admin') {
            this.router.navigate(['/admin/get-project']);
          } else {
            this.router.navigate(['/user-profile']);
          }
        }
      })
    );
  }

  // -----------------------------
  // 🚪 Logout
  // -----------------------------
  logout() {
    this.auth.logout(); // 👈 Call AuthService logout
  }

  // -----------------------------
  // 🏗️ Add Project (with images & brochure)
  // -----------------------------
  addProject(
    projectData: Partial<Project>,
    images: FileList | null,
    brochure: File | null
  ): Observable<Project> {
    const formData = new FormData();

    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value)); // For location object
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (images) Array.from(images).forEach(file => formData.append('gallery', file));
    if (brochure) formData.append('brochure', brochure);

    return this.http.post<Project>(this.apiUrl, formData);
  }

  // -----------------------------
  // 📦 Post project using FormData directly
  // -----------------------------
  postProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, formData);
  }

  // -----------------------------
  // 📂 Get all projects
  // -----------------------------
  getProjects(): Observable<Project[]> {
    return this.http.get<{ success: boolean; projects: Project[] }>(this.apiUrl)
      .pipe(map(res => res.projects));
  }

  // -----------------------------
  // 📄 Get single project by ID
  // -----------------------------
  getProjectById(id: string): Observable<Project> {
    return this.http.get<{ success: boolean; project: Project }>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.project));
  }

  // -----------------------------
  // ❌ Delete project by ID
  // -----------------------------
  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
