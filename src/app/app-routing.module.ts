import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsPageComponent } from './components/pages/projects/projects.component';
import { AuthPageComponent } from './components/pages/auth/auth.component';
import { VerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { ResetComponent }  from './components/pages/reset/reset.component';


const routes: Routes = [
  { path:'', component: AuthPageComponent },
  { path:'projects', component: ProjectsPageComponent },
  { path: 'verify/:token', component: VerifyEmailComponent },
  { path: 'reset/:token', component: ResetComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
