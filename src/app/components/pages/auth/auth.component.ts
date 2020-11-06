import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RegisterUser } from '../../../models/RegisterUser';
import { LoginUser } from '../../../models/LoginUser';
import { ForgotUser } from 'src/app/models/ForgotUser';

const MISSING_REQUIRED_FIELDS:string = 'There are missing required fields or errors to fix.';
const REGISTER_SUCCESS:string = 'You\'ve successfully registered. Please verify your email before attempting to login.';
const FORGOT_SUCCESS:string = 'Please check you\'re email inbox for details.';
const GENERAL_ERROR_RESPONSE: string = 'There was a problem with the request... Please try again after some time.';

const ALPHANUMERIC_REGEX:string = '^[a-zA-Z0-9]*$';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthPageComponent implements OnInit {
  usernameFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(16)
  ]);
  passwordFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(50)
  ]);

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
  emailFC = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(50)
  ]);
  registerUsernameFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(16)
  ]);
  registerPasswordFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(50)
  ]);
  confirmPasswordFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX),
    Validators.maxLength(50)
  ]);

  forgotEmailFC = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(50)
  ]); 

  authPage: string = 'login';

  loginUsername: string;
  loginPassword: string;

  registerFirstName: string;
  registerLastName: string;
  registerEmail: string;
  registerUsername: string;
  registerPassword: string;
  registerConfirmPassword: string;

  forgotEmail: string;

  responseErrorMessage: string = '';
  responseSuccessMessage: string = '';

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void { 
    // If the user is already logged in, redirect to the experiences page.
    if (localStorage.getItem('loggedInUsername') !== null) {
        this.router.navigate(['experiences']);
    }
  }

  onSignUpClick() {
    this.authPage = 'register';
    this.clearInputFields();
    this.resetLoadingIcon();
  }

  onBackClick() {
    this.authPage = 'login';
    this.clearInputFields();
    this.resetLoadingIcon();
  }

  onForgotClick() {
    this.authPage = 'forgot';
    this.clearInputFields();
    this.resetLoadingIcon();
  }

  enableLoadingIcon() {
    this.isLoading = true;
  }

  disableLoadingIcon() {
    this.isLoading = false;
  }

  setLoggedInUsername(username:string) {
    localStorage.setItem(
      'loggedInUsername',
      username
    );
  }

  onLoginClick() {
    this.clearResponseMessages();
    // If the username and password provided is valid, send credentials to the server and
    // if successful, login the user else present error UI.
    if (this.usernameFC.valid && this.passwordFC.valid) {
      this.enableLoadingIcon();
      let loginUser = new LoginUser(this.loginUsername, this.loginPassword);
      this.authService.loginUser(loginUser).subscribe(res => {
        this.disableLoadingIcon();
        this.setLoggedInUsername(res.username);
        this.router.navigate(['experiences']);
      },
      (err) => {
        this.disableLoadingIcon();
        if (err.error.error === undefined) {
          this.responseErrorMessage = GENERAL_ERROR_RESPONSE;
        } else {
          this.responseErrorMessage = err.error.error;
        }
      });
    } else {
      this.responseErrorMessage = MISSING_REQUIRED_FIELDS;
    }
  }

  onRegisterClick() {
    this.clearResponseMessages();
    // If the provided registration details are valid, attempt to register the user and wait for a response.
    // If the register response is successful, set the logged in username and redirect to the experiences page.
    // If the register response is not successful, present the error UI.
    if (this.firstNameFC.valid && this.lastNameFC.valid && this.emailFC.valid && this.registerUsernameFC.valid &&
      this.registerPasswordFC.valid && this.confirmPasswordFC.valid) {
        if (this.checkPasswordsMatch()) {
          this.enableLoadingIcon();
          let registerUser = new RegisterUser(this.registerUsername, this.registerEmail, this.registerPassword, this.registerFirstName,
            this.registerLastName);
          this.authService.registerUser(registerUser).subscribe(res => {
            this.disableLoadingIcon();
            this.responseSuccessMessage = REGISTER_SUCCESS;
          },
          (err) => {
            this.disableLoadingIcon();
            if (err.error.error === undefined) {
              this.responseErrorMessage = GENERAL_ERROR_RESPONSE;
            } else {
              this.responseErrorMessage = err.error.error;
            }
          });
        }
      } else {
        this.responseErrorMessage = MISSING_REQUIRED_FIELDS;
      }
  }

  onSendResetClick() {
    this.clearResponseMessages();
    // If the provided email is valid, send a request to server.
    if (this.forgotEmailFC.valid) {
      this.enableLoadingIcon();
      let forgotUser = new ForgotUser(this.forgotEmail);
      this.authService.forgotUsernameOrPassword(forgotUser).subscribe(res => {
        this.disableLoadingIcon();
        this.responseSuccessMessage = FORGOT_SUCCESS;
      },
      (err) => {
        this.disableLoadingIcon();
        if (err.error.error === undefined) {
          this.responseErrorMessage = GENERAL_ERROR_RESPONSE;
        } else {
          this.responseErrorMessage = err.error.error;
        }
      });
    } else {
      this.responseErrorMessage = MISSING_REQUIRED_FIELDS;
    }
  }

  clearInputFields() {
    this.loginUsername = undefined;
    this.loginPassword = undefined;
    this.registerFirstName = undefined;
    this.registerLastName = undefined;
    this.registerEmail = undefined;
    this.registerUsername = undefined;
    this.registerPassword = undefined;
    this.registerConfirmPassword = undefined;
    this.forgotEmail = undefined;
    this.responseErrorMessage = undefined;
    this.responseSuccessMessage = undefined;
  }

  clearResponseMessages() {
    this.responseErrorMessage = undefined;
    this.responseSuccessMessage = undefined;
  }

  checkPasswordsMatch() {
    if (this.registerPassword === this.registerConfirmPassword) {
      return true;
    } else {
      this.responseErrorMessage = 'Passwords don\'t match.';
      return false;
    }
  }

  resetLoadingIcon() {
    this.isLoading = false;
  }

  getUsernameErrorMessage() {
    if (this.usernameFC.hasError('required')) {
      return 'You must provide a username.';
    } else if (this.usernameFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.usernameFC.hasError('maxlength')) {
      return 'Your username can be at most 16 characters long.';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage() {
    if (this.passwordFC.hasError('required')) {
      return 'You must provide a password.';
    } else if (this.passwordFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.passwordFC.hasError('maxlength')) {
      return 'Your password can be at most 50 characters long.';
    } else {
      return '';
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

  getEmailErrorMessage() {
    if (this.emailFC.hasError('required')) {
      return 'You must provide an email.';
    } else if (this.emailFC.hasError('email')) {
      return 'You must provide a valid email.';
    } else if (this.emailFC.hasError('maxlength')) {
      return 'Your email can be at most 50 characters long.';
    } else {
      return '';
    }
  }

  getRegisterUsernameErrorMessage() {
    if (this.registerUsernameFC.hasError('required')) {
      return 'You must provide a username.';
    } else if (this.registerUsernameFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.registerUsernameFC.hasError('maxlength')) {
      return 'Your username can be at most 16 characters long.';
    } else {
      return '';
    }
  }

  getRegisterPasswordErrorMessage() {
    if (this.registerPasswordFC.hasError('required')) {
      return 'You must provide a password.';
    } else if (this.registerPasswordFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.registerPasswordFC.hasError('maxlength')) {
      return 'Your password can be at most 50 characters long.';
    } else {
      return '';
    }
  }

  getConfirmPasswordErrorMessage() {
    if (this.confirmPasswordFC.hasError('required')) {
      return 'You must provide a confirm password.';
    } else if (this.confirmPasswordFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else if (this.confirmPasswordFC.hasError('maxlength')) {
      return 'Your confirm password can be at most 50 characters long.';
    } else {
      return '';
    }
  }

  getForgotEmailErrorMessage() {
    if (this.forgotEmailFC.hasError('required')) {
      return 'You must provide an email.';
    } else if (this.forgotEmailFC.hasError('email')) {
      return 'You must provide a valid email.';
    } else if (this.forgotEmailFC.hasError('maxlength')) {
      return 'Your email can be at most 50 characters long.';
    } else {
      return '';
    }
  }
}
