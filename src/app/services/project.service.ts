import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../models/Project';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectsUrl:string = 'https://jsonplaceholder.typicode.com/todos';
  projectsLimit = '?_limit=20';

  constructor(private http:HttpClient) { }

  // Get projects
  getProjects():Observable<Project[]> {
    return this.http.get<Project[]>(`${this.projectsUrl}${this.projectsLimit}`);
  }

  // Delete project
  deleteProject(project:Project):Observable<Project> {
    const url = `${this.projectsUrl}/${project.id}`;
    return this.http.delete<Project>(url, httpOptions);
  }

  // Edit project
  editProject(project:Project):Observable<Project> {
    const url = `${this.projectsUrl}/${project.id}`;
    return this.http.put<Project>(url, httpOptions);
  }

  // Add project
  addProject(project:Project):Observable<Project> {
    return this.http.post<Project>(this.projectsUrl, project, httpOptions);
  }
}

