import { Component, Inject, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { Project } from 'src/app/models/Project';
import { Tag } from 'src/app/models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { ProjectService } from 'src/app/services/project.service';
import { Router } from '@angular/router';

export interface DialogData {
  oldTitle: string,
  updatedTitle: string,
  updatedDescription: string,
  updatedTags: Tag[]
}

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent {
  @Input() project: Project;
  @Output() editProject: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(EditProjectDialog, {
      data: { oldTitle: this.project.title, updatedTitle: this.project.title, updatedDescription: this.project.description, updatedTags: this.project.tags }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.updatedTags.length <= 4) {
        this.project.title = result.updatedTitle
        this.project.description = result.updatedDescription
        this.project.tags = result.updatedTags;
        this.project.updatedTitle = result.updatedTitle;
        this.project.updatedDescription = result.updatedDescription;
        this.project.updatedTags = result.updatedTags;

        const project = {
          title: this.project.title,
          description: this.project.description,
          tags: this.project.tags,
          updatedTitle: result.updatedTitle,
          updatedDescription: result.updatedDescription,
          updatedTags: result.updatedTags,
          oldTitle: result.oldTitle
        }
    
        this.editProject.emit(project);
      }
    });
  }
}

const FREEFORMTEXT_REGEX:string = '^[a-zA-Z0-9,./\'!%&;: ]*$';
const TAGS_ERROR_MSG:string = 'You can only have up to 6 tags.';
const GENERAL_EDIT_ERROR: string = 'There was a problem with the request... Please try again after some time.';

@Component({
  selector: 'edit-project-dialog',
  templateUrl: 'edit-project-dialog.html',
  styleUrls: ['./edit-project-dialog.css']
})
export class EditProjectDialog implements OnInit {
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
  tagsList:Tag[];
  errorMessage: string;
  isLoading: boolean = false;
  loggedInUsername: string;

  constructor(
    public dialogRef: MatDialogRef<EditProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService,
    private projectService: ProjectService,
    private router: Router
  ) {
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
    this.clearErrorMessage();
   }

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
    for (const tag of this.data.updatedTags) {
      this.selectedTags.push(tag.name);
    }
    this.data.updatedTags = this.selectedTags;
  }
  
  onCloseClick(editClose: boolean): void {
    if (editClose) {
      this.clearErrorMessage();
      this.enableLoadingSpinner();
      this.data.updatedTags = [];
      for (const tag of this.selectedTags) {
        this.data.updatedTags.push(this.tagsList.find(t => t.name === tag));
      }
      let project:Project = {
        username: this.loggedInUsername, 
        title: this.data.oldTitle, 
        description: undefined, 
        tags: undefined,
        updatedTitle: this.data.updatedTitle,
        updatedDescription: this.data.updatedDescription,
        updatedTags: this.data.updatedTags,
        oldTitle: this.data.oldTitle
      };
      this.projectService.editProject(project).subscribe(res => {
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
