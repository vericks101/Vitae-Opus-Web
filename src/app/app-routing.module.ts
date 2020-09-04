import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsPageComponent } from './components/pages/projects/projects.component';
import { AuthPageComponent } from './components/pages/auth/auth.component';


const routes: Routes = [
  { path:'', component: AuthPageComponent },
  { path:'projects', component: ProjectsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
