import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  tags = new FormControl();

  tagsList: string[] = ['Javascript', 'HTML', 'CSS', 'Java', 'C#', 'C++'];

  constructor() { }

  ngOnInit(): void {
  }

}
