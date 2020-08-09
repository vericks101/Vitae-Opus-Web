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
      if (result != undefined) {
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

@Component({
  selector: 'edit-project-dialog',
  templateUrl: 'edit-project-dialog.html',
  styleUrls: ['./edit-project-dialog.css']
})
export class EditProjectDialog implements OnInit {
  titleFC = new FormControl('', [Validators.required]);
  descriptionFC = new FormControl('', [Validators.required]);

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
    return this.titleFC.hasError('required') ? 'You must provide a project title.' : '';
  }

  getDescriptionErrorMessage() {
    return this.titleFC.hasError('required') ? 'You must provide a project description.' : '';
  }
}
