---
disqus: http://sturdynut.com/blog/2016/07/22/angular-cli-todo-mvc.html
layout: post
background: "43.jpg"
title: "Angular CLI"
author: "Matti Salokangas"
description: A guide to building the classic TodoMVC using Angular CLI.
comments: true
keywords: angular, angular cli, cli
tags:
  - angular
  - angular-cli
  - todoMVC
---

This is a guide to build the Angular 2 [Todo MVC](https://github.com/tastejs/todomvc) application using the [Angular CLI](https://cli.angular.io/).

### Installation

`npm install -g angular-cli`

### Already got it?

`npm update -g angular-cli`

At the time of this writing, I am running 1.0.0-beta.5.  To check, just run `ng -v`.

### Creating an App

From your terminal:

* `ng new angular-2-todo-app`
* `cd angular-2-todo-app`
* `ng serve`
* [http://localhost:4200](http://localhost:4200)

![image](/images/posts/angular-cli/angular-app-success.png)

### Digging In

Open up the code using your favorite text editor or IDE.

#### Bootstrapping the Root Component

Starting up an Angular app is called Bootstrapping.
Bootstrapping requires a root component, which has already been created for you by the CLI.

You can find the root component here

`/src/app/angular-2-todo-app.component.*`.

You can see how the root application is passed to the `bootstrap()` function in `/src/main.ts`.

```html
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
// Load up root component
import { Angular2TodoAppAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(Angular2TodoAppAppComponent); // Zing!
```

### Todo Model

First we need a model to represent an item in our todo list.

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

### Todo Service

We now need a service to add, remove and get items.

`ng g service todo-store`

Go ahead and just copy/paste the code below into the new service.

`/src/app/todo-store.service.ts`

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

### Todo List Component

Since we have our model and store, we can now tie things together with a component.

`ng g component todo-list`

Let's make some adjustments to each file:

File: `/app/todo-list/todo-list.component.html`

```html
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
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
</section>
```

* File: `/app/todo-list/todo-list.component.ts`

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

### Add to Root Component

Let's add the Todo component to our root component and see where we are.

Update each file accordingly:

File: `/src/app/angular-2-todo-app.component.html`

```html
<section class="todoapp">
  <app-todo-list></app-todo-list>
</section>
```

File: `/src/app/angular-2-todo-app.component.ts`

```javascript
import { Component, ViewEncapsulation } from '@angular/core';
// Import the todo-list component.
import { TodoListComponent } from './todo-list/todo-list.component'

@Component({
  moduleId: module.id,
  selector: 'angular-2-todo-app-app',
  templateUrl: 'angular-2-todo-app.component.html',
  styleUrls: ['angular-2-todo-app.component.css'],
  encapsulation: ViewEncapsulation.None, // We'll get to this later...
  directives: [TodoListComponent] // Inject component here
})
export class Angular2TodoAppAppComponent {
}
```

### Kill the Tests

To keep things simple, go ahead and comment out the code in all of the `.spec.ts` files.

### Done!

Go take a peak at your todo list app and you should see something like this.

![image](/images/posts/angular-cli/functional.png)

_Not pretty, but it works!_

### Styles

At this point you have a functional application and you can stop.

But, we are professionals.  So we are going to style this thing and we're gonna do it with SASS.

#### Install Packages

**SASS**

`npm install node-sass sass-loader --save-dev`

**TodoMVC CSS**

`npm install todomvc-common todomvc-app-css --save`

#### Including Styles

For simplicity, we are going to copy in the styles from node_modules.

`cp ./node_modules/todomvc-common/base.css ./src/app/todomvc-common.base.scss`

`cp ./node_modules/todomvc-app-css/index.css ./src/app/todomvc-app-css.index.scss`

Next, we need to rename our root application's css file and import the todo mvc libraries.

Rename `/src/app/angular-2-todo-app.component.css` to `/src/app/angular-2-todo-app.component.scss`

Update the file as follows:

```css
@import 'todomvc-common.base.scss';
@import 'todomvc-app-css.index.scss';
```

### That's it!

Your final app should look something like this:

![image](/images/posts/angular-cli/styled.png)

I hope this gave you a taste of Angular CLI, if you run into any issues feel free to post in the comments section below.

