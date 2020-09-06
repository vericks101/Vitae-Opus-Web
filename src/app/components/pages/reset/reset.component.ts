import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ResetService } from 'src/app/services/reset.service';
import { ResetPassword } from 'src/app/models/ResetPassword';

const ALPHANUMERIC_REGEX:string = '^[a-zA-Z0-9]*$';
const RESPONSE_SUCCESS:string = 'Your password has been successfully reset.';
const RESPONSE_FAILURE:string = 'Something went wrong when attempting to reset your password.';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  passwordFC = new FormControl('', [
    Validators.required,
    Validators.pattern(ALPHANUMERIC_REGEX)
  ]);

  responseErrorMessage:string = '';
  responseSuccessMessage:string = '';
  isLoading:boolean = false;

  newPassword:string;
  username:string;

  pageState:string = 'success';

  constructor(
    private activatedRoute: ActivatedRoute,
    private resetService: ResetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let resetPassword = new ResetPassword(params.token, undefined, undefined);
      this.resetService.verifyResetToken(resetPassword).subscribe(res => {
        this.username = res.username;
        this.pageState = 'success';
      },
      (err) => {
        this.pageState = 'failure';
      });
    });
  }

  enableLoadingIcon() {
    this.isLoading = true;
  }

  disableLoadingIcon() {
    this.isLoading = false;
  }

  onReturnToLogin() {
    this.router.navigate(['']);
  }

  onSubmitClick() {
    if (this.passwordFC.valid) {
      this.clearResponseMessages();
      this.enableLoadingIcon();
      let resetPassword = new ResetPassword(undefined, this.username, this.newPassword);
      this.resetService.resetPassword(resetPassword).subscribe(res => {
        this.disableLoadingIcon();
        this.responseSuccessMessage = RESPONSE_SUCCESS;
      },
      (err) => {
        this.disableLoadingIcon();
        this.responseSuccessMessage = RESPONSE_FAILURE;
      });
    }
  }

  clearResponseMessages() {
    this.responseSuccessMessage = undefined;
    this.responseErrorMessage = undefined;
  }

  getPasswordErrorMessage() {
    if (this.passwordFC.hasError('required')) {
      return 'You must provide a password.';
    } else if (this.passwordFC.hasError('pattern')) {
      return 'You must provide only alphanumeric characters.';
    } else {
      return '';
    }
  }
}
