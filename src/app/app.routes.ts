import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'hi',
    component: HomeComponent
  },
  {
    path: 'en',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
