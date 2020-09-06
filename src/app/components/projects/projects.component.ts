import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/Project';
import { Tag } from '../../models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { AuthService } from 'src/app/services/auth.service';

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
  
  constructor(
    private projectService:ProjectService, 
    private tagsService: TagService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 1600) ? 1 : 5;
    // this.projectService.getProjects().subscribe(projects => {
    //   this.projects = projects;
    // });
    this.projects = [
      {id: 1, title: 'foo 1', description: 'foo bar 1', tags: [{userId: 1, id: 1, title: 'delectus aut autem', completed: false}]},
      {id: 2, title: 'foo 2', description: 'foo bar 2', tags: [{userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed:false}]},
      {id: 3, title: 'foo 3', description: 'foo bar 2', tags: [{userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed:false}]},
      {id: 4, title: 'foo 4', description: 'foo bar 2', tags: [{userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed:false}]},
      {id: 5, title: 'foo 5', description: 'foo bar 2', tags: [{userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed:false}]},
      {id: 6, title: 'foo 6', description: 'foo bar 2', tags: [{userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed:false}]}
    ]
    this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1600) ? 1 : 5;
  }

  deleteProject(project:Project) {
    this.projectService.deleteProject(project).subscribe(() => {
      this.projects = this.projects.filter(p => p.id !== project.id);
    });
  }

  editProject(project:Project) {
    this.projectService.editProject(project).subscribe(project => {
      this.projects[this.projects.findIndex(p => p.id === project.id)] = project;
    });
  }

  addProject(project:Project) {
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
    console.log(this.selectedTags);
    // Filter on tags if present.
    var tagFilteredProjects = [];
    if (this.selectedTags && this.selectedTags.length > 0) {
      for (const project of this.projects) {
        var addProject = true;
        for (const tagTitle of this.selectedTags) {
          if (!project.tags.some(t => t.title === tagTitle)) {
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
