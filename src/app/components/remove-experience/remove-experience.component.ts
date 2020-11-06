import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-experience',
  templateUrl: './remove-experience.component.html',
  styleUrls: ['./remove-experience.component.css']
})
export class RemoveExperienceComponent {
  @Output() removeExperience: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(RemoveExperienceDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      // If result is defined, emit the request for removal from the component.
      if (result)
        this.removeExperience.emit();
    });
  }
}

@Component({
  selector: 'remove-experience-dialog',
  templateUrl: 'remove-experience-dialog.html',
  styleUrls: ['./remove-experience-dialog.css']
})
export class RemoveExperienceDialog {
  constructor(
    public dialogRef: MatDialogRef<RemoveExperienceDialog>,
  ) { }
  
  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
