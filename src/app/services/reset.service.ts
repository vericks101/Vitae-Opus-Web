import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResetPassword } from 'src/app/models/ResetPassword';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ResetService {
  verifyResetUrl:string = 'https://vitae-opus-server.herokuapp.com/api/reset';
  resetPasswordUrl:string = 'https://vitae-opus-server.herokuapp.com/api/resetPasswordViaUsername';

  constructor(private http:HttpClient) { }

  // Verify Reset Token
  verifyResetToken(resetPassword:ResetPassword):Observable<ResetPassword> {
    return this.http.post<ResetPassword>(this.verifyResetUrl, resetPassword, httpOptions);
  }

  // Reset Password
  resetPassword(resetPassword:ResetPassword):Observable<ResetPassword> {
    return this.http.post<ResetPassword>(this.resetPasswordUrl, resetPassword, httpOptions);
  }
}
