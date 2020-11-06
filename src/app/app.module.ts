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
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { ProfileDialog } from './components/layout/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExperienceItemComponent } from './components/experience-item/experience-item.component';
import { AddExperienceComponent } from './components/add-experience/add-experience.component';
import { AddExperienceDialog } from './components/add-experience/add-experience.component';
import { AddTagComponent } from './components/add-tag/add-tag.component';
import { AddTagDialog } from './components/add-tag/add-tag.component';
import { EditExperienceComponent } from './components/edit-experience/edit-experience.component';
import { EditExperienceDialog } from './components/edit-experience/edit-experience.component';
import { RemoveExperienceComponent } from './components/remove-experience/remove-experience.component';
import { RemoveExperienceDialog } from './components/remove-experience/remove-experience.component';
import { ExperiencesPageComponent } from './components/pages/experiences/experiences.component';
import { ExperiencesComponent } from './components/experiences/experiences.component';
import { AuthPageComponent } from './components/pages/auth/auth.component';
import { VerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { ResetComponent } from './components/pages/reset/reset.component';
import { ManageTagsComponent } from './components/manage-tags/manage-tags.component';
import { ManageTagsDialog } from './components/manage-tags/manage-tags.component';
import { RemoveTagDialog } from './components/manage-tags/manage-tags.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileDialog,
    ExperiencesComponent,
    ExperienceItemComponent,
    AddExperienceComponent,
    AddExperienceDialog,
    AddTagComponent,
    AddTagDialog,
    EditExperienceComponent,
    EditExperienceDialog,
    RemoveExperienceComponent,
    RemoveExperienceDialog,
    ExperiencesPageComponent,
    AuthPageComponent,
    VerifyEmailComponent,
    ResetComponent,
    ManageTagsComponent,
    ManageTagsDialog,
    RemoveTagDialog
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
    MatProgressSpinnerModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
