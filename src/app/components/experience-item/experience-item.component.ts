import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Experience } from 'src/app/models/Experience';
import { Router } from '@angular/router';

@Component({
  selector: 'app-experience-item',
  templateUrl: './experience-item.component.html',
  styleUrls: ['./experience-item.component.css']
})
export class ExperienceItemComponent implements OnInit {
  @Input() experience: Experience;
  @Output() removeExperience: EventEmitter<any> = new EventEmitter();
  @Output() editExperience: EventEmitter<any> = new EventEmitter();
  
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
    this.experience = $event;
    this.editExperience.emit(this.experience);
  }

  // If the removal is emitted, capture it here and emit it further.
  receiveRemoval() {
    this.experience.username = this.loggedInUsername;
    this.removeExperience.emit(this.experience);
  }
}
