import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('loggedInUsername') === null) {
      console.log('no logged in user');
    } else {
      console.log(localStorage.getItem('loggedInUsername'));
    }
  }

  onSignOutClick() {
    this.clearLoggedInUsername();
    this.router.navigate(['']);
  }

  clearLoggedInUsername() {
    localStorage.removeItem('loggedInUsername');
  }
}
