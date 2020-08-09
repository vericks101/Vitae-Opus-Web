import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { Tag } from 'src/app/models/Tag';
import { TagService } from 'src/app/services/tag.service';

export interface DialogData {
  title: string,
  description: string,
  tags: Tag[]
}

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  title: string;
  description: string;
  tags: Tag[];

  @Output() addProject: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDialog, {
      data: {title: '', description: '', tags: undefined}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.title = result.title;
        this.description = result.description;
        this.tags = result.tags;
  
        const project = {
          title: this.title,
          description: this.description,
          tags: this.tags
        }
    
        this.addProject.emit(project);
      }
    });
  }
}

@Component({
  selector: 'add-project-dialog',
  templateUrl: 'add-project-dialog.html',
  styleUrls: ['./add-project-dialog.css']
})
export class AddProjectDialog implements OnInit {
  titleFC = new FormControl('', [Validators.required]);
  descriptionFC = new FormControl('', [Validators.required]);

  tags = new FormControl();

  tagsList: Tag[];

  constructor(
    public dialogRef: MatDialogRef<AddProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService
  ) {}

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
  }
  
  onCloseClick(): void {
    this.dialogRef.close();
  }

  getTitleErrorMessage() {
    return this.titleFC.hasError('required') ? 'You must provide a project title.' : '';
  }

  getDescriptionErrorMessage() {
    return this.titleFC.hasError('required') ? 'You must provide a project description.' : '';
  }
}
