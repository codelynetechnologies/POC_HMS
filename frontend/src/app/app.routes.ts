import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/patient-registration/patient-registration.component').then(
        (m) => m.PatientRegistrationComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
