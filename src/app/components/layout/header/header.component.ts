import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/Profile';
import { ProfileService } from 'src/app/services/profile.service';

export interface DialogData {
  username: string,
  email: string,
  firstName: string,
  lastName: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUsername: string;

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Pull username if user is logged in else redirect to login page.
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }

  // Called when Dialog is opened and initialized.
  openDialog(): void {
      const dialogRef = this.dialog.open(ProfileDialog, {
        data: {firstName: '', lastName: '', username: '', email: ''}
      });

      dialogRef.afterClosed().subscribe(() => { });
  }

  onSignOutClick() {
    // Clear logged in user and redirect to login page.
    this.clearLoggedInUsername();
    this.router.navigate(['']);
  }

  clearLoggedInUsername() {
    localStorage.removeItem('loggedInUsername');
  }
}

const ALPHANUMERIC_REGEX:string = '^[a-zA-Z0-9]*$';
const GENERAL_ERROR_RESPONSE: string = 'There was a problem with the request... Please try again after some time.';

@Component({
  selector: 'profile-dialog',
  templateUrl: 'profile-dialog.html',
  styleUrls: ['./profile-dialog.css']
})
export class ProfileDialog {
  firstNameFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(16)
  ]);
  lastNameFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(16)
  ]);

  errorMessage: string;
  isLoading: boolean = false;
  loggedInUsername: string;
  profilePage: string;

  constructor(
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.clearErrorMessage();
    this.setLoadingPage();
    // Pull username if user is logged in else redirect to login page.
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }

    // Grab profile data and once received, set data and update UI to loaded state.
    let profile: Profile = {
      username: this.loggedInUsername,
      email: undefined,
      firstName: undefined,
      lastName: undefined
    };
    this.profileService.getProfile(profile).subscribe(profile => {
      this.data.email = profile.email;
      this.data.firstName = profile.firstName;
      this.data.lastName = profile.lastName;
      this.data.username = profile.username;

      this.setProfilePage();
    },
    err => { });
  }
  
  onCloseClick(editClose: boolean): void {
    // If the dialog was closed with the command to edit the profile, disable loading UI and push profile
    // to the server and pass data to the close function to be added to the UI.
    if (editClose) {
      this.clearErrorMessage();
      this.enableLoadingSpinner();
      let profile: Profile = {
        username: this.loggedInUsername,
        email: this.data.email,
        firstName: this.data.firstName,
        lastName: this.data.lastName
      };
      this.profileService.editProfile(profile).subscribe(res => {
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

  getFirstNameErrorMessage() {
    if (this.firstNameFC.hasError('required')) {
      return 'You must provide a first name.';
    } else if (this.firstNameFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.firstNameFC.hasError('maxlength')) {
      return 'Your first name can be at most 16 characters long.';
    } else {
      return '';
    }
  }

  getLastNameErrorMessage() {
    if (this.lastNameFC.hasError('required')) {
      return 'You must provide a last name.';
    } else if (this.lastNameFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.lastNameFC.hasError('maxlength')) {
      return 'Your last name can be at most 16 characters long.';
    } else {
      return '';
    }
  }

  getErrorMessage() {
    return GENERAL_ERROR_RESPONSE;
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  setErrorMessage(): void {
    this.errorMessage = GENERAL_ERROR_RESPONSE;
  }

  disableLoadingSpinner(): void {
    this.isLoading = false;
  }

  enableLoadingSpinner(): void {
    this.isLoading = true;
  }

  setProfilePage(): void {
    this.profilePage = 'profile';
  }

  setLoadingPage(): void {
    this.profilePage = 'loading';
  }
}