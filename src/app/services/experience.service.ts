import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Experience } from '../models/Experience';
import { Observable, throwError } from 'rxjs';
import { LoginUser } from '../models/LoginUser';
import { catchError } from 'rxjs/internal/operators/catchError';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  experiencesUrl:string = 'https://vitae-opus-server.herokuapp.com/api/experience';

  constructor(private http:HttpClient) { }

  // Get experiences
  getExperiences(user:LoginUser):Observable<Experience[]> {
    return this.http.post<Experience[]>(`${this.experiencesUrl}/getExperiences`, user, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  // Remove experience
  removeExperience(experience:Experience):Observable<Experience> {
    return this.http.post<Experience>(`${this.experiencesUrl}/removeExperience`, experience, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  // Edit experience
  editExperience(experience:Experience):Observable<Experience> {
    return this.http.put<Experience>(`${this.experiencesUrl}/editExperience`, experience, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  // Add experience
  addExperience(experience:Experience):Observable<Experience> {
    return this.http.post<Experience>(`${this.experiencesUrl}/addExperience`, experience, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server Error");
  }
}

