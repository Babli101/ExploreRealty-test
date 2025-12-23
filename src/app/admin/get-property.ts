import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeService, Property } from '../subscribe.service';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError, finalize, of, Observable, tap, map } from 'rxjs';

@Component({
  selector: 'app-get-property',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './get-property.html',
  styleUrls: ['./get-property.scss']
})
export class GetProperty implements OnInit {

  properties$!: Observable<Property[]>;
  loading = true;

  constructor(
    private subscribeService: SubscribeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.properties$ = this.subscribeService.getProperty().pipe(
      tap(res => console.log('Property list:', res)),
      catchError(err => {
        console.error('❌ Error fetching property:', err);
        return of([]);
      }),
      finalize(() => this.loading = false)
    );
  }

  // 🖼️ Image
  getImage(property: Property): string {
    const baseUrl = environment.apiBaseUrl.replace('/api', '');

    if (!property.gallery?.length) return 'assets/noimage.jpg';

    let path = property.gallery[0].url || property.gallery[0].filename;
    if (!path) return 'assets/noimage.jpg';

    if (!path.startsWith('http')) {
      if (!path.startsWith('/')) path = '/' + path;
      path = baseUrl + path;
    }

    return path;
  }

  // 💰 Price
  getPrice(property: Property): string {
  return property.price ? String(property.price) : 'N/A';
}


  viewProject(property: Property) {
    if (property._id) {
      this.router.navigate(['/property', property._id]);
    }
  }

  deleteProject(property: Property) {
    if (!property._id) return;
    if (!confirm(`Delete ${property.placeName}?`)) return;

    this.subscribeService.deleteProject(property._id).subscribe({
      next: () => {
        this.properties$ = this.properties$.pipe(
          map(list => list.filter(p => p._id !== property._id))
        );
      },
      error: err => console.error('Delete error:', err)
    });
  }
}
