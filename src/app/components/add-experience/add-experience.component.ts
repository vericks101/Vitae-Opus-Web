import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Tag } from 'src/app/models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { Experience } from 'src/app/models/Experience';
import { ExperienceService } from 'src/app/services/experience.service';
import { Router } from '@angular/router';

const GENERAL_ADD_ERROR: string = 'There was a problem adding the experience... Please try again after some time.';

export interface DialogData {
  title: string,
  description: string,
  tags: Tag[]
}

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.css']
})
export class AddExperienceComponent {
  title: string;
  description: string;
  tags: Tag[];

  @Output() addExperience: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  // Called when Dialog is opened and initialized.
  openDialog(): void {
    const dialogRef = this.dialog.open(AddExperienceDialog, {
      data: {title: '', description: '', tags: undefined}
    });

    dialogRef.afterClosed().subscribe(result => {
      // Ensure that the dialog result is well defined and emit it from the component to be added.
      if (result != undefined && (result.tags === undefined || result.tags.length <= 4)) {
        this.title = result.title;
        this.description = result.description;
        this.tags = result.tags;
  
        const experience = {
          title: this.title,
          description: this.description,
          tags: this.tags
        }
    
        this.addExperience.emit(experience);
      }
    });
  }
}

const FREEFORMTEXT_REGEX:string = '^[a-zA-Z0-9,./\'!%&;: ]*$';
const TAGS_ERROR_MSG:string = 'You can only have up to 4 tags.';

@Component({
  selector: 'add-experience-dialog',
  templateUrl: 'add-experience-dialog.html',
  styleUrls: ['./add-experience-dialog.css']
})
export class AddExperienceDialog implements OnInit {
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

  tags = new FormControl();
  tagsList: Tag[];
  errorMessage: string;
  isLoading: boolean = false;
  loggedInUsername: string;

  constructor(
    public dialogRef: MatDialogRef<AddExperienceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService,
    private experienceService: ExperienceService,
    private router: Router
  ) {
    // Pull username if user is logged in else redirect to login page.
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
    this.clearErrorMessage();
  }

  ngOnInit() {
    // Sync current tags with master tag service's tag listing.
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
  }
  
  onCloseClick(addClose: boolean): void {
    // If the dialog was closed with the command to add an experience, disable loading UI and push experience
    // to the server and pass data to the close function to be added to the UI.
    if (addClose) {
      this.clearErrorMessage();
      this.enableLoadingSpinner();
      let experience:Experience = {
        username: this.loggedInUsername, 
        title: this.data.title, 
        description: this.data.description, 
        tags: this.data.tags,
        updatedTitle: undefined,
        updatedDescription: undefined,
        updatedTags: undefined,
        oldTitle: undefined
      };
      this.experienceService.addExperience(experience).subscribe(res => {
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
    this.errorMessage = GENERAL_ADD_ERROR;
  }

  disableLoadingSpinner(): void {
    this.isLoading = false;
  }

  enableLoadingSpinner(): void {
    this.isLoading = true;
  }
}
