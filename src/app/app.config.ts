import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from './user/home.component';
import { ContactComponent } from './user/contact.component';
import { PageComponent } from './user/page.component';
import { ProjectComponent } from './user/project.component';
import { UserContactListComponent } from './admin/user-contactlist.component';
import { AddProjectComponent } from './admin/add-project.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { SingleProjectComponent } from './user/single-project';
import { SingleComponent } from './admin/single';
import { GetProject } from './admin/get-project';
import { LoginComponent } from './user/login';

const routes: Routes = [
  {
  path: '',
  component: UserComponent,
  children: [
    { path: '', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'page', component: PageComponent },
    { path: 'project', component: ProjectComponent },
    { path: 'single-project/:id', component: SingleProjectComponent },
    { path: 'login', component: LoginComponent }
  ]
},
{
  path: 'admin',
  component: AdminComponent,
  children: [
    { path: 'user-contactlist', component: UserContactListComponent },
    { path: 'add-project', component: AddProjectComponent },
    { path: 'get-project', component: GetProject },
    { path: 'project/:id', component: SingleComponent },
    { path: '**', redirectTo: '/' }
  ]
}

];

export const appConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() // ✅ Enable fetch API for SSR
    )
  ]
};
