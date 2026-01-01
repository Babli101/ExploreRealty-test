import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

// -----------------------------
// Interfaces
// -----------------------------
export interface GalleryItem {
  url: string;
  filename: string;
}

export interface Property {
  _id?: string;

  placeName: string;
  price: number;
  size: number;

  saleType?: ('Rent' | 'Buy')[];
  propertyType: ('Residential' | 'Commercial')[];
  propertyCategory: ('Plot' | 'Flat' | 'Shop' | 'House')[];
  furnishing?: ('Furnished' | 'Semi-Furnished' | 'Unfurnished')[];
  bhkType?: ('1BHK' | '2BHK' | '3BHK' | 'Studio')[];
  status?: ('Ready to Move' | 'Under Construction')[];

  floor?: number;
  address: string;
  description?: string;

  gallery: GalleryItem[];
  createdAt?: string;
}

// -----------------------------
// Service
// -----------------------------
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/properties`;

  constructor(private http: HttpClient) { }

  // ✅ GET ALL
  getAllProperties(): Observable<Property[]> {
    return this.http
      .get<{ success: boolean; data: Property[] }>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  // ✅ GET BY ID
  getPropertyById(id: string): Observable<Property> {
    return this.http
      .get<{ success: boolean; data: Property }>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  // 🔥 ADD PROPERTY (FormData – images supported)
  // 🔥 ADD PROPERTY (FormData – images supported)
  addProperty(data: FormData): Observable<Property> {
    return this.http
      .post<{ success: boolean; data: Property }>(this.apiUrl, data)
      .pipe(map(res => res.data));
  }



  // 🔥 UPDATE PROPERTY (JSON OR FormData – BOTH SUPPORTED)
  updateProperty(
    id: string,
    data: Property | FormData
  ): Observable<Property> {
    return this.http
      .put<{ success: boolean; data: Property }>(
        `${this.apiUrl}/${id}`,
        data
      )
      .pipe(map(res => res.data));
  }

  // ✅ DELETE PROPERTY
  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
