import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../services/experience.service';
import { Experience } from '../../models/Experience';
import { Tag } from '../../models/Tag';
import { TagService } from 'src/app/services/tag.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const GENERAL_REMOVE_ERROR: string = 'There was a problem with the request... Please try again after some time.';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.css']
})
export class ExperiencesComponent implements OnInit {
  selectedTags = [];
  searchValue = '';
  tagsOrSearchPresent = false;

  breakpoint: number;

  experiences: Experience[];
  filteredExperiences: Experience[];
  tagsList: Tag[];

  loggedInUsername: string;
  experiencesPage: string;
  
  constructor(
    private experienceService: ExperienceService, 
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
    this.setLoadingPage();

    // Get the current user's experiences from the server and set the experiences. Do the same for the user's tags.
    this.breakpoint = (window.innerWidth <= 1600) ? 1 : 5;
    this.experienceService.getExperiences({username: this.loggedInUsername, password: undefined}).subscribe(experiences => {
      this.experiences = experiences;

      this.tagsService.requestGetTags({username: this.loggedInUsername, password: undefined}).subscribe(tags => {
        this.tagsService.updateTags(tags);
        this.tagsService.currentTags.subscribe(tagsList => this.tagsList = tagsList);

        this.setExperiencesPage();
      });
    });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1600) ? 1 : 5;
  }

  deleteExperience(experience:Experience) {
    // With the provided experience, request to remove the experience from the server and if
    // successful, remove locally and update in the UI.
    this.experienceService.removeExperience(experience).subscribe(() => {
      this.experiences = this.experiences.filter(p => p.title !== experience.title);
    },
    err => {
      this.openSnackBar(GENERAL_REMOVE_ERROR, 'Close');
    });
  }

  editExperience(experience:Experience) {
    // Find the edited experience and set it the new experience.
    this.experiences[this.experiences.findIndex(p => p.title === experience.oldTitle)] = experience;
  }

  addExperience(experience:Experience) {
    // Given the new experience, add it to the end of the experiences listing.
    this.experiences.push(experience);
    this.onSelectedTagsOrSearchChange();
  }

  addTag(tag:Tag) {
    // Given the new tag, add it the end of the tags listing.
    this.tagsList.push(tag);
    this.tagsService.updateTags(this.tagsList);
  }

  receiveAdd($event) {
    // When a add is emitted, capture it here and add the experience.
    this.addExperience($event);
  }

  openSnackBar(message: string, action: string) {
    // Called when a experience is added. Open the snackbar with the provided message, action,
    // and duration to be open.
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onSelectedTagsOrSearchChange() {
    // Filter on tags if present.
    var tagFilteredExperiences = [];
    if (this.selectedTags && this.selectedTags.length > 0) {
      for (const experience of this.experiences) {
        var addExperience = true;
        for (const tagTitle of this.selectedTags) {
          if (!experience.tags.some(t => t.name === tagTitle)) {
            addExperience = false;
          }
        }
        if (addExperience) {
          tagFilteredExperiences.push(experience);
        }
      }
      this.filteredExperiences = tagFilteredExperiences;
      this.tagsOrSearchPresent = true;
    } else {
      this.tagsOrSearchPresent = false;
    }

    // Filter on search value if present.
    if (this.searchValue && this.searchValue !== '') {
      this.filteredExperiences = [];
      if (this.selectedTags && this.selectedTags.length > 0) {
        // Filter on tagFilteredExperiences if we already filtered on tags present.
        for (const experience of tagFilteredExperiences) {
          if (experience.title.includes(this.searchValue.trim()) || experience.description.includes(this.searchValue.trim())) {
            this.filteredExperiences.push(experience);
          }
        }
      } else {
        // Filter on overall experiences if we haven't already filtered on tags present.
        for (const experience of this.experiences) {
          if (experience.title.includes(this.searchValue.trim()) || experience.description.includes(this.searchValue.trim())) {
            this.filteredExperiences.push(experience);
          }
        }
      }
      this.tagsOrSearchPresent = true;
    } else if (!this.tagsOrSearchPresent) {
      this.tagsOrSearchPresent = false;
    }
  }

  setLoadingPage(): void {
    this.experiencesPage = 'loading';
  }

  setExperiencesPage(): void {
    this.experiencesPage = 'experiences';
  }
}
