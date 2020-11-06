import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperiencesPageComponent } from './components/pages/experiences/experiences.component';
import { AuthPageComponent } from './components/pages/auth/auth.component';
import { VerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { ResetComponent }  from './components/pages/reset/reset.component';


const routes: Routes = [
  { path:'', component: AuthPageComponent },
  { path:'experiences', component: ExperiencesPageComponent },
  { path: 'verify/:token', component: VerifyEmailComponent },
  { path: 'reset/:token', component: ResetComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
