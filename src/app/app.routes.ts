import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/components/full/full.component').then(
            (c) => c.FullComponent
          ),
      },
      {
        path: 'live-video',
        loadComponent: () =>
          import('./pages/components/live-video/live-video.component').then(
            (c) => c.LiveVideoComponent
          ),
      },
      {
        path: 'process-video',
        loadComponent: () =>
          import('./pages/components/video-processing/video-processing.component').then(
            (c) => c.VideoProcessingComponent
          ),
      },
      {
        path: 'process-image',
        loadComponent: () =>
          import('./pages/components/image-processing/image-processing.component').then(
            (c) => c.ImageProcessingComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];