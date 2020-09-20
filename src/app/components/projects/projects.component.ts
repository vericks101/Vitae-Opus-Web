import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';
import { Tag } from '../../models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  selectedTags = [];
  searchValue = '';
  tagsOrSearchPresent = false;

  breakpoint: number;

  projects:Project[];
  filteredProjects:Project[];
  tagsList:Tag[];

  loggedInUsername:string;
  
  constructor(
    private projectService:ProjectService, 
    private tagsService: TagService,
    private router: Router
    ) {
      if (localStorage.getItem('loggedInUsername') === null) {
        this.router.navigate(['']);
      } else {
        this.loggedInUsername = localStorage.getItem('loggedInUsername');
      }
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 1600) ? 1 : 5;
    this.projectService.getProjects({username: this.loggedInUsername, password: undefined}).subscribe(projects => {
      this.projects = projects;
    });
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1600) ? 1 : 5;
  }

  deleteProject(project:Project) {
    this.projectService.removeProject(project).subscribe(() => {
      this.projects = this.projects.filter(p => p.title !== project.title);
    });
  }

  editProject(project:Project) {
    project.username = this.loggedInUsername;
    this.projectService.editProject(project).subscribe(project => {
      this.projects[this.projects.findIndex(p => p.title === project.oldTitle)] = project;
    });
  }

  addProject(project:Project) {
    project.username = this.loggedInUsername;
    this.projectService.addProject(project).subscribe(() => {
      this.projects.unshift(project);
      this.onSelectedTagsOrSearchChange();
    });
  }

  addTag(tag:Tag) {
    this.tagsList.push(tag);
    this.tagsService.updateTags(this.tagsList);
  }

  receiveAdd($event) {
    this.addProject($event);
  }

  onSelectedTagsOrSearchChange() {
    // Filter on tags if present.
    var tagFilteredProjects = [];
    if (this.selectedTags && this.selectedTags.length > 0) {
      for (const project of this.projects) {
        var addProject = true;
        for (const tagTitle of this.selectedTags) {
          if (!project.tags.some(t => t.name === tagTitle)) {
            addProject = false;
          }
        }
        if (addProject) {
          tagFilteredProjects.push(project);
        }
      }
      this.filteredProjects = tagFilteredProjects;
      this.tagsOrSearchPresent = true;
    } else {
      this.tagsOrSearchPresent = false;
    }

    // Filter on search value if present.
    if (this.searchValue && this.searchValue !== '') {
      this.filteredProjects = [];
      if (this.selectedTags && this.selectedTags.length > 0) {
        // Filter on tagFilteredProjects if we already filtered on tags present.
        for (const project of tagFilteredProjects) {
          if (project.title.includes(this.searchValue.trim()) || project.description.includes(this.searchValue.trim())) {
            this.filteredProjects.push(project);
          }
        }
      } else {
        // Filter on overall projects if we haven't already filtered on tags present.
        for (const project of this.projects) {
          if (project.title.includes(this.searchValue.trim()) || project.description.includes(this.searchValue.trim())) {
            this.filteredProjects.push(project);
          }
        }
      }
      this.tagsOrSearchPresent = true;
    } else if (!this.tagsOrSearchPresent) {
      this.tagsOrSearchPresent = false;
    }
  }
}
