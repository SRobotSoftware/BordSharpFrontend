import { Injectable } from '@angular/core';
// import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';

// const API_URL = environment.apiUrl;
const API_URL = '/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  tasks = []
  boards = []

  public getAllTasks(){
    console.log('getting tasks')
    const res = this.http
      .get(API_URL+'/Tasks')
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  public createTask(task) {
    console.log('Creating new task')
    console.log({task})
    const res = this.http
      .post(`${API_URL}/Tasks`, task)
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  public getTaskById() {

  }
  public updateTask(task) {
    console.log(`Updating task ${task.taskId}`)
    const jsonTask = {
      boardId: task.boardId,
      description: task.description,
      priority: task.priority,
      isCompleted: task.isCompleted,
    }
    if (task.priority === '!!') jsonTask.priority = 'high'
    else if (task.priority === '!') jsonTask.priority = 'medium'
    else jsonTask.priority = 'low'
    console.log(jsonTask)
    const res = this.http
      .put(`${API_URL}/Tasks/${task.taskId}`, jsonTask)
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  public deleteTaskById(taskId) {
    return this.http.delete(`${API_URL}/Tasks/${taskId}`)
  }
  public getTasksByBoardId(id) {
    console.log(`getting tasks for board ${id}`)
    const res = this.http
      .get(`${API_URL}/Boards/${id}/tasks`)
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  public getAllBoards() {
    console.log('getting boards')
    const res = this.http
      .get(API_URL+'/Boards')
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  public createBoard(name) {
    console.log('Creating Board')
    const res = this.http
      .post(`${API_URL}/Boards`, {name})
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  public getBoardById() {

  }
  public updateBoard() {

  }
  public deleteBoardById(boardId) {
    const res = this.http
      .delete(`${API_URL}/Boards/${boardId}`)
      .pipe(
        tap(
          data => console.log(data),
          error => console.error(error)
        )
      )
    return res
  }
  private handleError (error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent)
      console.error('An error occurred:', error.error.message)
    else
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
        );
    return throwError('Something bad happened; please try again later.');
  }
}
