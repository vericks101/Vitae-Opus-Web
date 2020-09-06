import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerifyEmail } from 'src/app/models/VerifyEmail';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class VerifyService {
  verifyUrl:string = 'http://localhost:3001/api/verify';

  constructor(private http:HttpClient) { }

  // Verify Email
  verifyEmail(verifyEmail:VerifyEmail):Observable<VerifyEmail> {
    return this.http.post<VerifyEmail>(this.verifyUrl, verifyEmail, httpOptions);
  }
}