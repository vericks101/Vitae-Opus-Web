import { Component, Inject, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Experience } from 'src/app/models/Experience';
import { Tag } from 'src/app/models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { ExperienceService } from 'src/app/services/experience.service';
import { Router } from '@angular/router';

export interface DialogData {
  oldTitle: string,
  updatedTitle: string,
  updatedDescription: string,
  updatedTags: Tag[]
}

@Component({
  selector: 'app-edit-experience',
  templateUrl: './edit-experience.component.html',
  styleUrls: ['./edit-experience.component.css']
})
export class EditExperienceComponent {
  @Input() experience: Experience;
  @Output() editExperience: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  // Open and initialize the dialog.
  openDialog(): void {
    const dialogRef = this.dialog.open(EditExperienceDialog, {
      data: { oldTitle: this.experience.title, updatedTitle: this.experience.title, updatedDescription: this.experience.description, updatedTags: this.experience.tags }
    });

    dialogRef.afterClosed().subscribe(result => {
      // If the result is well defined, create an experience out of it and emit it from the component to be edited.
      if (result != undefined && result.updatedTags.length <= 4) {
        this.experience.title = result.updatedTitle
        this.experience.description = result.updatedDescription
        this.experience.tags = result.updatedTags;
        this.experience.updatedTitle = result.updatedTitle;
        this.experience.updatedDescription = result.updatedDescription;
        this.experience.updatedTags = result.updatedTags;

        const experience = {
          title: this.experience.title,
          description: this.experience.description,
          tags: this.experience.tags,
          updatedTitle: result.updatedTitle,
          updatedDescription: result.updatedDescription,
          updatedTags: result.updatedTags,
          oldTitle: result.oldTitle
        }
    
        this.editExperience.emit(experience);
      }
    });
  }
}

const FREEFORMTEXT_REGEX:string = '^[a-zA-Z0-9,./\'!%&;: ]*$';
const TAGS_ERROR_MSG:string = 'You can only have up to 4 tags.';
const GENERAL_EDIT_ERROR: string = 'There was a problem with the request... Please try again after some time.';

@Component({
  selector: 'edit-experience-dialog',
  templateUrl: 'edit-experience-dialog.html',
  styleUrls: ['./edit-experience-dialog.css']
})
export class EditExperienceDialog implements OnInit {
  titleFC = new FormControl('', [
    Validators.required,
    Validators.pattern(FREEFORMTEXT_REGEX),
    Validators.maxLength(12)
  ]);
  descriptionFC = new FormControl('', [
    Validators.required,
    Validators.pattern(FREEFORMTEXT_REGEX),
    Validators.maxLength(195)
  ]);

  selectedTags = [];
  tagsList: Tag[];
  errorMessage: string;
  isLoading: boolean = false;
  loggedInUsername: string;

  constructor(
    public dialogRef: MatDialogRef<EditExperienceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService,
    private experienceService: ExperienceService,
    private router: Router
  ) {
    // Pull username if it exists else redirect to the login page.
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
    this.clearErrorMessage();
   }

  ngOnInit() {
    // Sync the current tags with the master tag service's tag listing.
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
    for (const tag of this.data.updatedTags) {
      this.selectedTags.push(tag.name);
    }
    this.data.updatedTags = this.selectedTags;
  }
  
  onCloseClick(editClose: boolean): void {
    // If the command is to edit the experience, create a experience object based on the edited data and push it the server.
    // Also, pass it to the close function to be updated in the UI.
    if (editClose) {
      this.clearErrorMessage();
      this.enableLoadingSpinner();
      this.data.updatedTags = [];
      for (const tag of this.selectedTags) {
        this.data.updatedTags.push(this.tagsList.find(t => t.name === tag));
      }
      let experience:Experience = {
        username: this.loggedInUsername, 
        title: this.data.oldTitle, 
        description: undefined, 
        tags: undefined,
        updatedTitle: this.data.updatedTitle,
        updatedDescription: this.data.updatedDescription,
        updatedTags: this.data.updatedTags,
        oldTitle: this.data.oldTitle
      };
      this.experienceService.editExperience(experience).subscribe(res => {
        this.disableLoadingSpinner();
        this.dialogRef.close(this.data);
      },
      err => {
        this.setErrorMessage();
        this.disableLoadingSpinner();
      });
    } else {
      this.dialogRef.close(undefined);
    }
  }

  getTitleErrorMessage() {
    if (this.titleFC.hasError('required')) {
      return 'You must provide a title.';
    } else if (this.titleFC.hasError('pattern')) {
      return 'You must provide only alphanumeric or punctuation characters.';
    } else if (this.titleFC.hasError('maxlength')) {
      return 'Your title can be at most 12 characters long.';
    } else {
      return '';
    }
  }

  getDescriptionErrorMessage() {
    if (this.descriptionFC.hasError('required')) {
      return 'You must provide a description.';
    } else if (this.descriptionFC.hasError('pattern')) {
      return 'You must provide only alphanumeric or punctuation characters.';
    } else if (this.descriptionFC.hasError('maxlength')) {
      return 'Your description can be at most 195 characters long.';
    } else {
      return '';
    }
  }

  getTagsErrorMessage() {
    return TAGS_ERROR_MSG;
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  setErrorMessage(): void {
    this.errorMessage = GENERAL_EDIT_ERROR;
  }

  disableLoadingSpinner(): void {
    this.isLoading = false;
  }

  enableLoadingSpinner(): void {
    this.isLoading = true;
  }
}
