import { Component, Inject, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { Project } from 'src/app/models/Project';
import { Tag } from 'src/app/models/Tag';
import { TagService } from 'src/app/services/tag.service';

export interface DialogData {
  title: string,
  description: string,
  tags: Tag[]
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
      data: {title: this.project.title, description: this.project.description, tags: this.project.tags}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.tags.length <= 6) {
        this.project.title = result.title;
        this.project.description = result.description;
        this.project.tags = result.tags;
  
        const project = {
          title: this.project.title,
          description: this.project.description,
          tags: this.project.tags
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
  //tags = new FormControl();

  tagsList:Tag[];

  constructor(
    public dialogRef: MatDialogRef<EditProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService 
  ) {}

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
    for (const tag of this.data.tags) {
      this.selectedTags.push(tag.title);
    }
    this.data.tags = this.selectedTags;
  }
  
  onCloseClick(): void {
    this.data.tags = [];
    for (const tag of this.selectedTags) {
      this.data.tags.push(this.tagsList.find(t => t.title === tag));
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
