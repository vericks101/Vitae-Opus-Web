import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Tag } from '../models/Tag';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginUser } from '../models/LoginUser';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tagsUrl:string = 'http://localhost:3001/api/tag';

  private tagsSource = new BehaviorSubject<Tag[]>([]);
  currentTags = this.tagsSource.asObservable();

  loggedInUsername:string;

  constructor(private http:HttpClient, private router:Router) {
    if (localStorage.getItem('loggedInUsername') === null) {
      this.router.navigate(['']);
    } else {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }

    this.requestGetTags({username: this.loggedInUsername, password: undefined}).subscribe(tags => {
      this.updateTags(tags);
    });
  }

  // Call server to get tags
  requestGetTags(user:LoginUser):Observable<Tag[]> {
    return this.http.post<Tag[]>(`${this.tagsUrl}/getTags`, user, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  // Call server to delete tag
  requestDeleteTag(tag:Tag):Observable<Tag> {
    return this.http.post<Tag>(`${this.tagsUrl}/removeTag`, tag, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  // Call server to add tag
  requestAddTag(tag:Tag):Observable<Tag> {
    return this.http.post<Tag>(`${this.tagsUrl}/addTag`, tag, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  addTag(tag:Tag) {
    this.requestAddTag(tag).subscribe(tag => {
      this.requestGetTags({username: this.loggedInUsername, password: undefined}).subscribe(tags => {
        tags.push(tag);
        this.updateTags(tags);
      });
    });
  }

  // Sync tags across all components that share this service.
  updateTags(tags: Tag[]) {
    this.tagsSource.next(tags);
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server Error");
  }
}