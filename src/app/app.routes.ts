import { Routes } from '@angular/router';
import { CreateQuotationComponent } from './features/create-quotation/create-quotation.component';
import { GenerateBillComponent } from './features/generate-bill/generate-bill.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'quotation', component: CreateQuotationComponent },
  { path: 'billing', component: GenerateBillComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
