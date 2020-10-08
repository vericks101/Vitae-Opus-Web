import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/models/Project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent implements OnInit {
  @Input() project: Project;
  @Output() removeProject: EventEmitter<any> = new EventEmitter();
  @Output() editProject: EventEmitter<any> = new EventEmitter();
  
  loggedInUsername: string;

  constructor(
    private router: Router
  ) {
    // Pull the logged in username else redirect to the login page.
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }

  ngOnInit(): void { }

  // If a edit is emitted, capture it here and emit it further.
  receiveEdit($event) {
    this.project = $event;
    this.editProject.emit(this.project);
  }

  // If the removal is emitted, capture it here and emit it further.
  receiveRemoval() {
    this.project.username = this.loggedInUsername;
    this.removeProject.emit(this.project);
  }
}
