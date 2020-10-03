import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DialogData {
  name: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('loggedInUsername') === null) {
        this.router.navigate(['']);
    } else {
      console.log(localStorage.getItem('loggedInUsername'));
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileDialog, {
      data: {name: ''}
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

  onSignOutClick() {
    this.clearLoggedInUsername();
    this.router.navigate(['']);
  }

  clearLoggedInUsername() {
    localStorage.removeItem('loggedInUsername');
  }
}

@Component({
  selector: 'profile-dialog',
  templateUrl: 'profile-dialog.html',
  styleUrls: ['./profile-dialog.css']
})
export class ProfileDialog {
  loggedInUsername: string;

  constructor(
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router
  ) {
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }
  
  onCloseClick(): void {
      this.dialogRef.close();
  }
}