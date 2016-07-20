---
disqus: http://sturdynut.com/blog/angular-cli-driven-todo-mvc.html
layout: post
background: "31.jpg"
title: "Angular CLI"
comments: true
tags:
  - angular
  - angular-cli
  - todoMVC
---

## Angular CLI

This is a guide to build out the Angular 2[todo MVC](https://github.com/tastejs/todomvc) app using the [Angular CLI](https://cli.angular.io/).

The [Angular CLI](https://cli.angular.io/) is a command-line-interface that allows you to create new Angular 2 apps.

### Installation

`npm install -g angular-cli`

### Already got it?

`npm update -g angular-cli`

At the time of this writing, I am running `1.0.0-beta.5`.  To check, just run `ng -v`.

### Creating an App

From your terminal:

* `ng new angular-2-todo-app`
* `cd angular-2-todo-app`
* `ng serve`
* [http://localhost:4200](http://localhost:4200)

*Sweet!  Great Job! :beers:*

#### Before you start...

1. Open up your `./src/index.html` file and ensure the root component looks like this:

```html
<angular-2-todo-app>Loading...</angular-2-todo-app>
```

2.  Open your `./src/main.ts` and ensure it looks like this:

```html
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Angular2TodoAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(Angular2TodoAppComponent);
```

### Todo Model

1. In `/app`, create a new file, let's name it `todo.model.ts`
2. Paste this into your new model:

```javascript
export class Todo {
  completed: Boolean;
  editing: Boolean;

  private _title: String;
  get title() {
    return this._title;
  }
  set title(value: String) {
    this._title = value.trim();
  }

  constructor(title: String) {
    this.completed = false;
    this.editing = false;
    this.title = title.trim();
  }
}
```

### 2. Todo Store Service

`ng g service todo-store`

```javascript
import { Injectable } from '@angular/core';
import { Todo } from './todo.model';

@Injectable()
export class TodoStoreService {
  todos: Array<Todo>;

  constructor() {
    let persistedTodos = JSON.parse(localStorage.getItem('angular2-todos') || '[]');
    // Normalize back into classes
    this.todos = persistedTodos.map((todo: { _title: String, completed: Boolean }) => {
      let ret = new Todo(todo._title);
      ret.completed = todo.completed;
      return ret;
    });
  }

  private updateStore() {
    localStorage.setItem('angular2-todos', JSON.stringify(this.todos));
  }

  private getWithCompleted(completed: Boolean) {
    return this.todos.filter((todo: Todo) => todo.completed === completed);
  }

  allCompleted() {
    return this.todos.length === this.getCompleted().length;
  }

  setAllTo(completed: Boolean) {
    this.todos.forEach((t: Todo) => t.completed = completed);
    this.updateStore();
  }

  removeCompleted() {
    this.todos = this.getWithCompleted(false);
    this.updateStore();
  }

  getRemaining() {
    return this.getWithCompleted(false);
  }

  getCompleted() {
    return this.getWithCompleted(true);
  }

  toggleCompletion(todo: Todo) {
    todo.completed = !todo.completed;
    this.updateStore();
  }

  remove(todo: Todo) {
    this.todos.splice(this.todos.indexOf(todo), 1);
    this.updateStore();
  }

  add(title: String) {
    this.todos.push(new Todo(title));
    this.updateStore();
  }
}
```

### Main Application component

Update each file accordingly:

File: `angular-2-todo.component.html`

```html
<section class="todoapp">
  <app-todo-list></app-todo-list>
</section>
```

File: `angular-2-todo-app.component.ts`

```javascript
import { Component } from '@angular/core';
// Import the todo-list component.
import { TodoListComponent } from './todo-list/todo-list.component'

@Component({
  moduleId: module.id,
  selector: 'angular-2-todo-app',
  templateUrl: 'angular-2-todo-app.component.html',
  styleUrls: ['angular-2-todo-app.component.css'],
  directives: [TodoListComponent]
})
export class Angular2TodoAppComponent {
}
```
File: `angular-2-todo-app.component.spec.ts`

```javascript
import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Angular2TodoAppComponent } from '../app/angular-2-todo-app.component';

beforeEachProviders(() => [Angular2TodoAppComponent]);

describe('App: Angular2TodoApp', () => {
  it('should create the app',
      inject([Angular2TodoAppComponent], (app: Angular2TodoAppComponent) => {
    expect(app).toBeTruthy();
  }));
});
```

### Todo List Component

* `ng g component todo-list`

File: `todo-list.component.ts`

```javascript
import { Component, OnInit } from '@angular/core';
// Import the todo object
import { Todo } from '../todo.model';
// Import the todo store
import { TodoStoreService } from '../todo-store.service';

@Component({
  moduleId: module.id,
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.css'],
  providers: [TodoStoreService]
})
export class TodoListComponent implements OnInit {
  todoStore: TodoStoreService;
  newTodoText: string = '';
  title: string = 'Todo MVC';

  constructor(todoStore: TodoStoreService) {
    this.todoStore = todoStore;
  }

  ngOnInit() {
  }

  stopEditing(todo: Todo, editedTitle: string) {
    todo.title = editedTitle;
    todo.editing = false;
  }

  cancelEditingTodo(todo: Todo) {
    todo.editing = false;
  }

  updateEditingTodo(todo: Todo, editedTitle: string) {
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return this.todoStore.remove(todo);
    }

    todo.title = editedTitle;
  }

  editTodo(todo: Todo) {
    todo.editing = true;
  }

  removeCompleted() {
    this.todoStore.removeCompleted();
  }

  toggleCompletion(todo: Todo) {
    this.todoStore.toggleCompletion(todo);
  }

  remove(todo: Todo) {
    this.todoStore.remove(todo);
  }

  addTodo() {
    if (this.newTodoText.trim().length) {
      this.todoStore.add(this.newTodoText);
      this.newTodoText = '';
    }
  }

}
```

File: `todo-list.component.html`

```html
<header class="header">
  <h1>{{title}}</h1>
  <input class="new-todo" placeholder="What needs to be done?" autofocus="" [(ngModel)]="newTodoText" (keyup.enter)="addTodo()">
</header>
<section class="main" *ngIf="todoStore.todos.length > 0">
  <input class="toggle-all" type="checkbox" *ngIf="todoStore.todos.length" #toggleall [checked]="todoStore.allCompleted()" (click)="todoStore.setAllTo(toggleall.checked)">
  <ul class="todo-list">
    <li *ngFor="let todo of todoStore.todos" [class.completed]="todo.completed" [class.editing]="todo.editing">
      <div class="view">
        <input class="toggle" type="checkbox" (click)="toggleCompletion(todo)" [checked]="todo.completed">
        <label (dblclick)="editTodo(todo)">{{todo.title}}</label>
        <button class="destroy" (click)="remove(todo)"></button>
      </div>
      <input class="edit" *ngIf="todo.editing" [value]="todo.title" #editedtodo (blur)="stopEditing(todo, editedtodo.value)" (keyup.enter)="updateEditingTodo(todo, editedtodo.value)" (keyup.escape)="cancelEditingTodo(todo)">
    </li>
  </ul>
</section>
<footer class="footer" *ngIf="todoStore.todos.length > 0">
  <span class="todo-count"><strong>{{todoStore.getRemaining().length}}</strong> {{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left</span>
  <button class="clear-completed" *ngIf="todoStore.getCompleted().length > 0" (click)="removeCompleted()">Clear completed</button>
</footer>
```

### Add Styles

*Install Packages*

`npm install node-sass sass-loader --save-dev`
`npm install todomvc-common todomvc-app-css --save`

Rename `app/angular-2-todo-app.css` to `app/angular-2-todo-app.scss`

```css
@import 'node_modules/todomvc-common/base.css';
@import 'node_modules/todomvc-app-css/index.css';
```

