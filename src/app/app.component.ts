import { Component, ViewChildren } from '@angular/core';
import { ApiService } from './api.service'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(
    private apiService: ApiService
  ) { }
  title = 'bord-sharp-frontend';

  boards = []
  boardsWithTasks = {}
  displayedColumns: string[] = ['taskId', 'priority', 'isCompleted', 'description', 'actions' ]
  priorityOptions = [
    {viewValue: 'low', value: 'low'},
    {viewValue: 'medium', value: 'medium'},
    {viewValue: 'high', value: 'high'},
  ]
  newTaskValues = {
    priority: '',
    description: '',
  }

  getBoardTasks(boardId) {
    this.apiService.getTasksByBoardId(boardId)
      .subscribe((data: any) => {
        this.boardsWithTasks[boardId] = data
        this.sortTasks()
      })
  }

  buildBoardsWithTasks() {
    this.apiService.getAllBoards()
      .subscribe((data: any) => {
        this.boards = data
        data.forEach(b => this.getBoardTasks(b.boardId))
        })
  }

  onClickCheck(task, board) {
    task.boardId = board.boardId
    task.isCompleted = !task.isCompleted
    this.updateTask(task)
  }

  onClickPrioritize(task, board) {
    task.boardId = board.boardId
    if (task.priority.length <= 1) {
      task.priority += '!'
    this.updateTask(task)
    }
  }

  onClickDeprioritize(task, board) {
    task.boardId = board.boardId
    if (task.priority.length >= 1) {
      task.priority = task.priority.slice(0, -1)
      this.updateTask(task)
    }
  }

  onClickDelete(task, board) {
    this.apiService.deleteTaskById(task.taskId)
      .subscribe()
    this.boardsWithTasks[board.boardId].tasks =
      this.boardsWithTasks[board.boardId].tasks
        .filter(t => task.taskId !== t.taskId)
  }

  onClickCreateTask(f: NgForm, boardId) {
    const vals = f.value
    this.apiService.createTask({
      boardId,
      priority: vals.priority,
      description: vals.description,
    })
    .subscribe((data: any) => {
      data.boardId = boardId
      this.boardsWithTasks[boardId].tasks.push(data)
      this.sortTasks()
    })
  }

  onClickCreateBoard(fb: NgForm) {
    const vals = fb.value
    this.apiService.createBoard(vals.name)
    .subscribe((data: any) => {
      this.boards.push(data)
      this.getBoardTasks(data.boardId)
    })
  }

  onClickDeleteBoard(boardId) {
    this.apiService.deleteBoardById(boardId)
      .subscribe((data: any) => {
        this.boards = this.boards.filter(x => x.boardId !== boardId)
      })
  }

  updateTask(task) {
    this.apiService.updateTask(task)
      .subscribe((data: any) => {
        task = data
        this.sortTasks()
      })
  }

  @ViewChildren('table') tables
  sortTasks() {
    Object.keys(this.boardsWithTasks)
      .forEach(key => {
        this.boardsWithTasks[key].tasks =
        this.boardsWithTasks[key].tasks
          .sort((a, b) => {
            if (a.isCompleted && !b.isCompleted) return 1
            if (!a.isCompleted && b.isCompleted) return -1

            if (a.priority.length > b.priority.length) return -1
            if (a.priority.length < b.priority.length) return 1

            return a.taskId - b.taskId
          })
      })
    this.tables.forEach(table => table.renderRows())
  }

  trackByTaskId(index, item) {
    return item.taskId
  }

  ngAfterViewInit() {
    this.buildBoardsWithTasks()
    this.tables.changes.subscribe((r) => {
      this.sortTasks()
    })
  }
}
