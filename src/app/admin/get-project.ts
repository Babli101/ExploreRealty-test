import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeService, Project } from '../subscribe.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError, finalize, of, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-get-project',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './get-project.html',
    styleUrls: ['./get-project.scss']
})
export class GetProject implements OnInit {
    projects$!: Observable<Project[]>;
    loading = true;

    constructor(
        private subscribeService: SubscribeService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // ✅ Fetch projects and extract array from backend response
        this.projects$ = this.subscribeService.getProjects().pipe(
            tap(res => console.log('Projects array:', res)), // debug
            catchError((err) => {
                console.error('❌ Error fetching projects:', err);
                this.loading = false;
                return of([] as Project[]);
            }),
            finalize(() => (this.loading = false))
        );
    }

    // 🖼️ Get image URL safely
    getImage(project: Project): string {
        const baseUrl = environment.apiBaseUrl?.replace(/\/api$/, '') || 'http://localhost:3000';

        if (project.gallery?.length) {
            const firstImage = project.gallery[0];
            const imageUrl = typeof firstImage === 'string'
                ? firstImage
                : firstImage.url || firstImage.filename;

            if (!imageUrl) return 'assets/noimage.jpg';

            // If already a full URL
            if (imageUrl.startsWith('http')) return imageUrl;

            // ✅ Match your backend path (no `/projects/` here)
            return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }

        // fallback
        return 'assets/noimage.jpg';
    }


    // 💰 Compute price dynamically
    getPrice(project: Project): string {
        if (project.category === 'residential') {
            return project.priceFrom || project.price1bhk || project.price2bhk || 'N/A';
        } else if (project.category === 'commercial') {
            return project.retailPrice || project.officePrice || 'N/A';
        }
        return (project as any).price || 'N/A'; // fallback for legacy field
    }

    viewProject(project: Project) {
        console.log('View project:', project);
        if (project._id) {
           this.router.navigate(['/project', project._id]);
        } else {
            console.warn('Project _id not found');
        }
    }

    deleteProject(project: Project) {
        if (!confirm(`Are you sure you want to delete ${project.name}?`)) return;

        if (!project._id) return;

        this.subscribeService.deleteProject(project._id).subscribe({
            next: (res: any) => {
                console.log('Deleted project:', res.message);
                this.projects$ = this.projects$.pipe(
                    map(projects => projects.filter(p => p._id !== project._id))
                );
            },
            error: (err) => console.error('Delete error:', err)
        });
    }



}
