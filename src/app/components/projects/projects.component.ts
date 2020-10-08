import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';
import { Tag } from '../../models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const GENERAL_REMOVE_ERROR: string = 'There was a problem with the request... Please try again after some time.';

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

  projects: Project[];
  filteredProjects: Project[];
  tagsList: Tag[];

  loggedInUsername: string;
  
  constructor(
    private projectService: ProjectService, 
    private tagsService: TagService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {
      // Grab logged in username else redirect to login page.
      if (localStorage.getItem('loggedInUsername') === null) {
        this.router.navigate(['']);
      } else {
        this.loggedInUsername = localStorage.getItem('loggedInUsername');
      }
  }

  ngOnInit() {
    // Get the current user's projects from the server and set the projects. Do the same for the user's tags.
    this.breakpoint = (window.innerWidth <= 1600) ? 1 : 5;
    this.projectService.getProjects({username: this.loggedInUsername, password: undefined}).subscribe(projects => {
      this.projects = projects;
    });
    this.tagsService.requestGetTags({username: this.loggedInUsername, password: undefined}).subscribe(tags => {
      this.tagsService.updateTags(tags);
      this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
    });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1600) ? 1 : 5;
  }

  deleteProject(project:Project) {
    // With the provided project, request to remove the project from the server and if
    // successful, remove locally and update in the UI.
    this.projectService.removeProject(project).subscribe(() => {
      this.projects = this.projects.filter(p => p.title !== project.title);
    },
    err => {
      this.openSnackBar(GENERAL_REMOVE_ERROR, 'Close');
    });
  }

  editProject(project:Project) {
    // Find the edited project and set it the new project.
    this.projects[this.projects.findIndex(p => p.title === project.oldTitle)] = project;
  }

  addProject(project:Project) {
    // Given the new project, add it to the end of the projects listing.
    this.projects.push(project);
    this.onSelectedTagsOrSearchChange();
  }

  addTag(tag:Tag) {
    // Given the new tag, add it the end of the tags listing.
    this.tagsList.push(tag);
    this.tagsService.updateTags(this.tagsList);
  }

  receiveAdd($event) {
    // When a add is emitted, capture it here and add the project.
    this.addProject($event);
  }

  openSnackBar(message: string, action: string) {
    // Called when a project is added. Open the snackbar with the provided message, action,
    // and duration to be open.
    this.snackBar.open(message, action, {
      duration: 3000,
    });
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
