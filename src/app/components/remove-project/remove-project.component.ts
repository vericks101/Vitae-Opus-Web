import { Component, EventEmitter, Output } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-remove-project',
  templateUrl: './remove-project.component.html',
  styleUrls: ['./remove-project.component.css']
})
export class RemoveProjectComponent {
  @Output() removeProject: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(RemoveProjectDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result)
        this.removeProject.emit();
    });
  }
}

@Component({
  selector: 'remove-project-dialog',
  templateUrl: 'remove-project-dialog.html',
  styleUrls: ['./remove-project-dialog.css']
})
export class RemoveProjectDialog {
  constructor(
    public dialogRef: MatDialogRef<RemoveProjectDialog>,
  ) {}
  
  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
