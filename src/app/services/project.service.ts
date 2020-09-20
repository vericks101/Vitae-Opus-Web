import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../models/Project';
import { Observable } from 'rxjs';
import { LoginUser } from '../models/LoginUser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectsUrl:string = 'http://localhost:3001/api/project';

  constructor(private http:HttpClient) { }

  // Get projects
  getProjects(user:LoginUser):Observable<Project[]> {
    return this.http.post<Project[]>(`${this.projectsUrl}/getProjects`, user, httpOptions);
  }

  // Remove project
  removeProject(project:Project):Observable<Project> {
    return this.http.post<Project>(`${this.projectsUrl}/removeProject`, project, httpOptions);
  }

  // Edit project
  editProject(project:Project):Observable<Project> {
    return this.http.put<Project>(`${this.projectsUrl}/editProject`, project, httpOptions);
  }

  // Add project
  addProject(project:Project):Observable<Project> {
    return this.http.post<Project>(`${this.projectsUrl}/addProject`, project, httpOptions);
  }
}

