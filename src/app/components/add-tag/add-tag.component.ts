import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/Tag';
import { Router } from '@angular/router';

export interface DialogData {
  name: string
}

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent {
  name: string;

  loggedInUsername: string;

  @Output() addTag: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, 
    private router: Router
    ) {
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTagDialog, {
      data: {name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.name = result.name;
        const tag = {
          username: this.loggedInUsername,
          name: this.name
        }
    
        this.addTag.emit(tag);
      }
    });
  }
}

const FREEFORMTEXT_REGEX:string = '^[a-zA-Z0-9,./\'!%&;: ]*$';
const GENERAL_ADD_TAG_ERROR: string = 'There was a problem adding the tag... Please try again after some time.';

@Component({
  selector: 'add-tag-dialog',
  templateUrl: 'add-tag-dialog.html',
  styleUrls: ['./add-tag-dialog.css']
})
export class AddTagDialog {
  titleFC = new FormControl('', [
    Validators.required,
    Validators.pattern(FREEFORMTEXT_REGEX),
    Validators.maxLength(16)
  ]);

  loggedInUsername: string;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddTagDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tagService: TagService,
    private router: Router
  ) {
    this.clearErrorMessage();

    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }
  
  onCloseClick(addClose:boolean): void {
    if (addClose) {
      this.clearErrorMessage();
      this.enableLoadingSpinner();
      let tag:Tag = {username:this.loggedInUsername, name:this.data.name};
      this.tagService.requestAddTag(tag).subscribe(res => {
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
      return 'You must provide a tag title.';
    } else if (this.titleFC.hasError('pattern')) {
      return 'You must provide only alphanumeric or punctuation characters.';
    } else if (this.titleFC.hasError('maxlength')) {
      return 'Your tag can be at most 16 characters long.';
    } else {
      return '';
    }
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  setErrorMessage(): void {
    this.errorMessage = GENERAL_ADD_TAG_ERROR;
  }

  disableLoadingSpinner(): void {
    this.isLoading = false;
  }

  enableLoadingSpinner(): void {
    this.isLoading = true;
  }
}