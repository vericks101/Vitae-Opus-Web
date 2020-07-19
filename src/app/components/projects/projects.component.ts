import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  breakpoint: number;
  constructor() { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 1600) ? 1 : 5;
}

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1600) ? 1 : 5;
  }

}
