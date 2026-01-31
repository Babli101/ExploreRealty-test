// src/app/subscribe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

/* -----------------------------
   Interfaces
----------------------------- */

export interface GalleryItem {
  url?: string;
  filename: string;
}

/* -------- PROJECT -------- */
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

/* -------- PROPERTY -------- */
export interface Property {
  _id?: string;
  placeName?: string;
  price?: number | string;

  // gallery ✅ FIXED
  gallery?: GalleryItem[];

  // basic details
  description?: string;
  address?: string;

  // pricing
  bprice?: number;

  // table data
  size?: number | string;
  status?: string[];
  floor?: number | string;
  transactionType?: string[];
  furnishing?: string[];
  age?: string;

  // contact
  phone?: string;
}



/* -----------------------------
   Service
----------------------------- */
@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  private baseUrl = environment.apiBaseUrl;

  private subscribeUrl = `${this.baseUrl}/subscribe`;
  private contactUrl   = `${this.baseUrl}/contact`;
  private projectUrl   = `${this.baseUrl}/projects`;
  private propertyUrl  = `${this.baseUrl}/properties`; // ✅ NEW
  private authUrl      = `${this.baseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  /* -----------------------------
     AUTH
  ----------------------------- */

  signup(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.auth.login(res.token, res.role || 'user');

          this.router.navigate([
            res.role === 'admin' ? '/admin/get-project' : '/user-profile'
          ]);
        }
      })
    );
  }

  logout() {
    this.auth.logout();
  }

  /* -----------------------------
     SUBSCRIBE / CONTACT
  ----------------------------- */

  subscribe(email: string): Observable<any> {
    return this.http.post(this.subscribeUrl, { email });
  }

  submitContact(data: any): Observable<any> {
    return this.http.post(this.contactUrl, data);
  }

  /* -----------------------------
     PROJECT APIs
  ----------------------------- */
  postProject(formData: FormData) {
  return this.http.post(`${this.projectUrl}`, formData);
}


  addProject(
    projectData: Partial<Project>,
    images: FileList | null,
    brochure: File | null
  ): Observable<Project> {

    const formData = new FormData();

    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : value as string
        );
      }
    });

    if (images) {
      Array.from(images).forEach(file =>
        formData.append('gallery', file)
      );
    }

    if (brochure) {
      formData.append('brochure', brochure);
    }

    return this.http.post<Project>(this.projectUrl, formData);
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get<{ success: boolean; projects: Project[] }>(this.projectUrl)
      .pipe(map(res => res.projects));
  }

  getProjectById(id: string): Observable<Project> {
    return this.http
      .get<{ success: boolean; project: Project }>(`${this.projectUrl}/${id}`)
      .pipe(map(res => res.project));
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.projectUrl}/${id}`);
  }

  /* -----------------------------
     PROPERTY APIs ✅
  ----------------------------- */

  getProperty(): Observable<Property[]> {
    return this.http
      .get<{ success: boolean; data: Property[] }>(this.propertyUrl)
      .pipe(map(res => res.data || []));
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http
      .get<{ success: boolean; data: Property }>(`${this.propertyUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.propertyUrl}/${id}`);
  }
}
