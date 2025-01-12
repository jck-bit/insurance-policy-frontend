import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PolicyFormComponent } from './policy-form/policy-form.component';

export const routes: Routes = [
  
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-policy', component: PolicyFormComponent },
  { path: 'edit-policy/:id', component: PolicyFormComponent },

]
;
