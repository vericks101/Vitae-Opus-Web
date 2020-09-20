import { Component, Inject, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { Project } from 'src/app/models/Project';
import { Tag } from 'src/app/models/Tag';
import { TagService } from 'src/app/services/tag.service';

export interface DialogData {
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
      data: {updatedTitle: this.project.title, updatedDescription: this.project.description, updatedTags: this.project.tags}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.updatedTags.length <= 6) {
        this.project.title = this.project.title;
        this.project.description = this.project.description;
        this.project.tags = this.project.tags;
        this.project.updatedTitle = result.updatedTitle;
        this.project.updatedDescription = result.updatedDescription;
        this.project.updatedTags = result.updatedTags;
  
        const project = {
          title: this.project.title,
          description: this.project.description,
          tags: this.project.tags,
          updatedTitle: this.project.updatedTitle,
          updatedDescription: this.project.updatedDescription,
          updatedTags: this.project.updatedTags
        }
    
        this.editProject.emit(project);
      }
    });
  }
}

const FREEFORMTEXT_REGEX:string = '^[a-zA-Z0-9,./\'!%&;: ]*$';
const TAGS_ERROR_MSG:string = 'You can only have up to 6 tags.';

@Component({
  selector: 'edit-project-dialog',
  templateUrl: 'edit-project-dialog.html',
  styleUrls: ['./edit-project-dialog.css']
})
export class EditProjectDialog implements OnInit {
  titleFC = new FormControl('', [
    Validators.required,
    Validators.pattern(FREEFORMTEXT_REGEX),
    Validators.maxLength(16)
  ]);
  descriptionFC = new FormControl('', [
    Validators.required,
    Validators.pattern(FREEFORMTEXT_REGEX),
    Validators.maxLength(270)
  ]);

  selectedTags = [];

  tagsList:Tag[];

  constructor(
    public dialogRef: MatDialogRef<EditProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService 
  ) {}

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
    for (const tag of this.data.updatedTags) {
      this.selectedTags.push(tag.name);
    }
    this.data.updatedTags = this.selectedTags;
  }
  
  onCloseClick(): void {
    this.data.updatedTags = [];
    for (const tag of this.selectedTags) {
      this.data.updatedTags.push(this.tagsList.find(t => t.name === tag));
    }

    this.dialogRef.close(this.data);
  }

  getTitleErrorMessage() {
    if (this.titleFC.hasError('required')) {
      return 'You must provide a title.';
    } else if (this.titleFC.hasError('pattern')) {
      return 'You must provide only alphanumeric or punctuation characters.';
    } else if (this.titleFC.hasError('maxlength')) {
      return 'Your username can be at most 16 characters long.';
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
      return 'Your username can be at most 270 characters long.';
    } else {
      return '';
    }
  }

  getTagsErrorMessage() {
    return TAGS_ERROR_MSG;
  }
}
