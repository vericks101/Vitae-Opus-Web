import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterUser } from '../models/RegisterUser';
import { LoginUser } from '../models/LoginUser';
import { ForgotUser } from '../models/ForgotUser';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl:string = 'http://localhost:3001/api/user';
  forgotUrl:string = 'http://localhost:3001/api/forgotusernameorpassword';

  constructor(private http:HttpClient) { }

  // Register User
  registerUser(registerUser:RegisterUser):Observable<RegisterUser> {
    return this.http.post<RegisterUser>(`${this.authUrl}/register`, registerUser, httpOptions);
  }

  // Login User
  loginUser(loginUser:LoginUser):Observable<LoginUser> {
    return this.http.post<LoginUser>(`${this.authUrl}/login`, loginUser, httpOptions);
  }

  // Forgot Username or Password
  forgotUsernameOrPassword(forgotUser:ForgotUser):Observable<ForgotUser> {
    return this.http.post<ForgotUser>(this.forgotUrl, forgotUser, httpOptions);
  }
}