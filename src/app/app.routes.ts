import { Routes } from '@angular/router';
import { CreateQuotationComponent } from './features/create-quotation/create-quotation.component';
import { GenerateBillComponent } from './features/generate-bill/generate-bill.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UserAccessComponent } from './features/user-access/user-access.component';
import { SettingsComponent } from './features/settings/settings.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ServiceRemindersComponent } from './features/service-reminders/service-reminders.component';
import { GstReportsComponent } from './features/gst-reports/gst-reports.component';
import { CustomerManagementComponent } from './features/customer-management/customer-management.component';
import { SalaryComponent } from './features/salary/salary.component';
import { UnderDevelopmentComponent } from './features/under-development/under-development.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'quotation', component: CreateQuotationComponent, canActivate: [AuthGuard] },
  { path: 'billing', component: GenerateBillComponent, canActivate: [AuthGuard] },
   { path: 'user-access', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: 'settings', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: 'notifications', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: 'service-reminders', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: 'salary-management', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: 'gst-reports', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: 'customer-management', component: UnderDevelopmentComponent , canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];