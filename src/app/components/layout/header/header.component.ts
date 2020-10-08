import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    // Ensure username exists else redirect to login page.
    if (localStorage.getItem('loggedInUsername') === null) {
        this.router.navigate(['']);
    }
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