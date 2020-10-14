import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profile } from '../models/Profile';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileUrl:string = 'https://vitae-opus-server.herokuapp.com/api/profile';

  constructor(private http:HttpClient) { }

  // Get Profile
  getProfile(profile: Profile):Observable<Profile> {
    return this.http.post<Profile>(`${this.profileUrl}/getUser`, profile, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  // Edit User
  editProfile(profile: Profile):Observable<Profile> {
    return this.http.put<Profile>(`${this.profileUrl}/editUser`, profile, httpOptions)
                    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server Error");
  }
}
