import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/Tag';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { LoginUser } from 'src/app/models/LoginUser';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/Project';

export interface DialogData {
  tags: Tag[]
}

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.css']
})
export class ManageTagsComponent implements OnInit {
  tagsList:Tag[];
  loggedInUsername: string;

  @Output() addTag: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog, 
    private router: Router,
    private tagsService: TagService
    ) {
      if (localStorage.getItem('loggedInUsername') === null) {
        this.router.navigate(['']);
      } else {
        this.loggedInUsername = localStorage.getItem('loggedInUsername');
      }
  }

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ManageTagsDialog, {
      data: {tagsList: this.tagsList}
    });

    dialogRef.afterClosed().subscribe(() => { });
  }
}

const TAG_IN_USE_ERROR: string = 'Can\'t remove a tag being used in a project.';
const GENERAL_REMOVE_ERROR: string = 'There was a problem with the request... Please try again after some time.';

@Component({
  selector: 'manage-tags-dialog',
  templateUrl: 'manage-tags-dialog.html',
  styleUrls: ['./manage-tags-dialog.css']
})
export class ManageTagsDialog implements OnInit {  
  tags = new FormControl();
  tagsList: Tag[];
  loggedInUsername: string;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ManageTagsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private tagsService: TagService,
    private projectsService: ProjectService
  ) { 
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
    this.clearErrorMessage();
    this.disableLoadingSpinner();
  }

  openDialog(tagName: string): void {
    const dialogRef = this.dialog.open(RemoveTagDialog, { });

    dialogRef.afterClosed().subscribe(confirmClick => {
      this.enableLoadingSpinner();
      this.clearErrorMessage();
      if (confirmClick) {
        // Ensure tag isn't currently in use.
        this.checkTagInUse(tagName).subscribe(projects => {
          let tagInUse: boolean = false;
          projects.forEach(project => {
            project.tags.forEach(tag => {
              if (tag.name === tagName)
              tagInUse = true;
            });
          });

          // Remove tag if it isn't being used currently.
          if (!tagInUse) {
            this.clearErrorMessage();
            this.disableLoadingSpinner();
            let tag: Tag = { username: this.loggedInUsername, name: tagName };
            this.tagsService.requestDeleteTag(tag).subscribe(() => {
              // Update the current tags list across the application with the provided tag removed.
              this.tagsService.requestGetTags({username: this.loggedInUsername, password: undefined}).subscribe(tags => {
                this.tagsService.updateTags(tags);
              },
              err => {
                this.setErrorMessage();
                this.disableLoadingSpinner();
              });
            },
            err => {
              this.setErrorMessage();
              this.disableLoadingSpinner();
            });
          } else {
            this.setInUseErrorMessage();
            this.disableLoadingSpinner();
          }
        },
        err => {
          this.setErrorMessage();
          this.disableLoadingSpinner();
        });
      }
    },
    err => {
      this.setErrorMessage();
      this.disableLoadingSpinner();
    });
  }
  
  onCloseClick(): void {
    this.dialogRef.close();
  }

  checkTagInUse(tagName: string): Observable<Project[]> {
    let user: LoginUser = { username: this.loggedInUsername, password: undefined };
    return this.projectsService.getProjects(user);
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  setInUseErrorMessage(): void {
    this.errorMessage = TAG_IN_USE_ERROR;
  }

  setErrorMessage(): void {
    this.errorMessage = GENERAL_REMOVE_ERROR;
  }

  disableLoadingSpinner(): void {
    this.isLoading = false;
  }

  enableLoadingSpinner(): void {
    this.isLoading = true;
  }
}

@Component({
  selector: 'remove-tag-dialog',
  templateUrl: 'remove-tag-dialog.html',
  styleUrls: ['./remove-tag-dialog.css']
})
export class RemoveTagDialog implements OnInit {  
  tags = new FormControl();
  tagsList: Tag[];

  constructor(
    public dialogRef: MatDialogRef<ManageTagsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagsService: TagService
  ) { }

  ngOnInit() {
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
  }
  
  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}