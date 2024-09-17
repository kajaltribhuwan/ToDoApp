import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { datamodel } from '../app/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/posts';
  constructor(private http: HttpClient) {}

  //add task
  addTask(data: datamodel): Observable<datamodel> {
    return this.http.post<datamodel>(this.baseUrl, data);
  }

  //get task
  getTask(): Observable<datamodel[]> {
    return this.http.get<datamodel[]>(this.baseUrl);
  }

  // Delete task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  // // delete
  // deleteTask(id: number) {
  //   return this.http.delete<datamodel[]>('http://localhost:3000/posts/' + id);
  // }

  // //fetch data
  // fetchdata(id: number) {
  //   return this.http.get<datamodel>(`http://localhost:3000/posts/${id}`);
  // }

  fetchdata(id: number): Observable<datamodel> {
    return this.http.get<datamodel>(`${this.baseUrl}/tasks/${id}`);
  }

  updateTask(id: number, task: datamodel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tasks/${id}`, task);
  }
}
