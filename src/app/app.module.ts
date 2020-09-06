import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AddProjectDialog } from './components/add-project/add-project.component';
import { AddTagComponent } from './components/add-tag/add-tag.component';
import { AddTagDialog } from './components/add-tag/add-tag.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { EditProjectDialog } from './components/edit-project/edit-project.component';
import { RemoveProjectComponent } from './components/remove-project/remove-project.component';
import { RemoveProjectDialog } from './components/remove-project/remove-project.component';
import { ProjectsPageComponent } from './components/pages/projects/projects.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AuthPageComponent } from './components/pages/auth/auth.component';
import { VerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { ResetComponent } from './components/pages/reset/reset.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsComponent,
    ProjectItemComponent,
    AddProjectComponent,
    AddProjectDialog,
    AddTagComponent,
    AddTagDialog,
    EditProjectComponent,
    EditProjectDialog,
    RemoveProjectComponent,
    RemoveProjectDialog,
    ProjectsPageComponent,
    AuthPageComponent,
    VerifyEmailComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDividerModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
