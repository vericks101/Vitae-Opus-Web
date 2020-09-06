import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyService } from 'src/app/services/verify.service';
import { VerifyEmail } from 'src/app/models/VerifyEmail';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  pageState:string = 'success';

  constructor(
    private activatedRoute: ActivatedRoute,
    private verifyService: VerifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let verifyEmail = new VerifyEmail(params.token);
      this.verifyService.verifyEmail(verifyEmail).subscribe(res => {
        this.pageState = 'success';
      },
      (err) => {
        this.pageState = 'failure';
      });
    });
  }

  onReturnToLogin() {
    this.router.navigate(['']);
  }
}
