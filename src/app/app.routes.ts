import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list.component';
import { UserDetailComponent } from './components/user-detail.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: '**', redirectTo: '' }
];