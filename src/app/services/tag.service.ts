import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Tag } from '../models/Tag';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tagsUrl:string = 'https://jsonplaceholder.typicode.com/todos';
  tagsLimit = '?_limit=7';

  private tagsSource = new BehaviorSubject<Tag[]>([]);
  currentTags = this.tagsSource.asObservable();

  constructor(private http:HttpClient) {
    this.requestGetTags().subscribe(tags => {
      this.updateTags(tags);
    });
  }

  // Call server to get tags
  requestGetTags():Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.tagsUrl}${this.tagsLimit}`);
  }

  // Call server to delete tag
  requestDeleteTag(tag:Tag):Observable<Tag> {
    const url = `${this.tagsUrl}/${tag.id}`;
    return this.http.delete<Tag>(url, httpOptions);
  }

  // Call server to add tag
  requestAddTag(tag:Tag):Observable<Tag> {
    return this.http.post<Tag>(this.tagsUrl, tag, httpOptions);
  }

  addTag(tag:Tag) {
    this.requestAddTag(tag).subscribe(tag => {
      this.requestGetTags().subscribe(tags => {
        tags.push(tag);
        this.updateTags(tags);
      });
    });
  }

  // Sync tags across all components that share this service.
  updateTags(tags: Tag[]) {
    this.tagsSource.next(tags);
  }
}