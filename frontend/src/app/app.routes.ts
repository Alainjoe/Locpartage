import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'annonces', loadComponent: () => import('./pages/annonces/annonce-list.component').then(m => m.AnnonceListComponent) },
  { path: 'annonces/nouvelle', canActivate: [authGuard], loadComponent: () => import('./pages/annonces/annonce-form.component').then(m => m.AnnonceFormComponent) },
  { path: 'annonces/:id', loadComponent: () => import('./pages/annonces/annonce-detail.component').then(m => m.AnnonceDetailComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'messages', canActivate: [authGuard], loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '**', redirectTo: '' }
];
