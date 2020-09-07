import { Component, Inject, EventEmitter, Output } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

export interface DialogData {
  title: string,
  description: string
}

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent {
  title: string;

  @Output() addTag: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTagDialog, {
      data: {id: 0, title: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.title = result.title;
        const tag = {
          id: 0,
          title: this.title
        }
    
        this.addTag.emit(tag);
      }
    });
  }
}

const FREEFORMTEXT_REGEX:string = '^[a-zA-Z0-9,./\'!%&;: ]*$';

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

  constructor(
    public dialogRef: MatDialogRef<AddTagDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  
  onCloseClick(): void {
    this.dialogRef.close();
  }

  getTitleErrorMessage() {
    if (this.titleFC.hasError('required')) {
      return 'You must provide a tag title.';
    } else if (this.titleFC.hasError('pattern')) {
      return 'You must provide only alphanumeric or punctuation characters.';
    } else if (this.titleFC.hasError('maxlength')) {
      return 'Your username can be at most 16 characters long.';
    } else {
      return '';
    }
  }
}