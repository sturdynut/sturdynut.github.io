---
disqus: http://sturdynut.com/blog/angular-2.html
layout: post
background: "3.jpg"
title: "Angular 2"
comments: true
tags:
  - angular
---

## Angular 2

Having recently attended ng-conf in Salt Lake City I wanted to capture all of the information I jammed into my brain for 4 days.  I cannot cover everything, but I'll start small and see where it goes.

First things first, here's some major changes introduced with Angular 2.

* Everything is built using **modules**.
* No more **$scope**, **factories**, **services**, **providers**, **constants** or **values**, everything is **classes**.
* No more **ng-app**, now we have a **root component**
* No more **controllers**, now we have **components**
* There is no digest cycle, there are now **zones**.
* No more filters, we now have **pipes**.
* No more handcrafting boilerplates, we now have **Angular CLI**.

That covers most of the things.  Let's dig into each of these a bit more...

### Modules

These aren't new with Angular 2 by any means.  Modules define the boundaries of you application, so divide and conquer thoughtfully.  I'm just glad we aren't relying on the order of our `<script></script>` tags anymore.  Ew.

If you aren't familiar with modules, check out the [module docs](https://angular.io/docs/ts/latest/guide/architecture.html#!#module).

**A quick note:  **

In the docs they say that modules are optional, however I believe what they really mean is that they are _technically_ optional, but really they are _conventionaly_ **not** optional.  Disagree?  [Tweet at me](https://twitter.com/sturdynut) and tell me your secrets.

### Classes

Yup, all the things are now gone and now we have `class`.  Everything is built using classes as you will see in the coming sections.  Bomb diggity.

#### A Basic Class
`simple.service.ts` - This is an example of a service, which is just a class.

```
// Importing things to use in my class
import {Injectable} from '@angular/core';
import {Monkey} from './monkey';

// Exporting my class so it can be imported somewhere else
@Injectable // Allows for me to inject dependencies into the constructor
export class MonkeyService {
  // Properties
  static someCount: number; // e.g. MonkeyService.someCount
  public isAwesome: boolean; // e.g. monkeySrv.isAwesome
  public data: [];  // e.g. monkeySrv.data

  // Constructor
  // Both defaultSort and defaultFilter will be added as private properties
  constructor(private defaultSort: string = 'name', private defaultFilter: string) {
  ...
  }

  // Methods
  getMonkey(id: number) {
    ...
  }
  getMonkeys() {
    ...
  }
}

```

### Components

At the heart of Angular 2 are components.  Components are the building blocks of your application.  Even your application is a component, conventionally named `app.component.ts`. This is a switch from Angular 1 where you are bootstrapping your application via `ng-app` or via the `angular.bootstrap` method.

In Angular 2 you could say that you are building a mountain of components with your `app.component.ts` at the top.  This is also why services are inherited down the mountain and each child component can get that instance without having to re-inject it.  Want your own instance?  Just inject it into your component and you will have a brand new instance.

For each component you'll also need a template and if you're want it to look good, some styles.

#### Here's a simple component.

```
// Import Component decorator and OnInit life cycle hook
import { Component, OnInit } from '@angular/core';

// This is the Component decorator where we specify the template, styles and tag.
// Example:  <simple-component></simple-component>
@Component({
  selector: 'simple-component',
  templateUrl: 'simple.component.html',
  styleUrls:['simple.component.css']
})
export class SimpleComponent implements OnInit {
  ...
}

```

#### Decorators

Let's de-mystify these strange creatures.  Decorators are simply "meta-data" for classes.  That's it.  Some languages pass this in using brackets, such as c#.  In Angular you use the `@DecoratorType()` syntax.

**Examples** `@Component()`, `@Injectable()`*, `@Directive()` or a `@Pipe()`.

* The `@Injectable()` decorator allows you to pass **Services** into your classes.  It's a good idea to just add this to all your classes, so you don't try to inject a service and have no idea why things are broken.  :sadpanda:

```
@Injectable
export class MonkeyService { ... }
```



#### Life Cycle hooks

You can hook into the life cycle of a component.  You will most common use `ngOnInit` to get data and do any initialization logic.  But, there are other useful hooks like `ngOnDestory` where you would want to unsubscribe from observables, because we always unsubscribe from obserables right?!?  #PreventMemoryLeaks

[Read more about life cycle hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html)


#### HeroesComponent Example

```
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {Hero} from './hero';
import {HeroDetailComponent} from './hero-detail.component';
import {HeroService} from './hero.service';

@Component({
  selector: 'my-heroes',
  templateUrl: 'app/heroes.component.html',
  styleUrls:['app/heroes.component.css'],
  directives: [HeroDetailComponent]
})

export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;
  constructor(
    private _router: Router,
    private _heroService: HeroService) { }
  getHeroes() {
    this._heroService.getHeroes().then(heroes => this.heroes = heroes);
  }
  ngOnInit() {
    this.getHeroes();
  }
  onSelect(hero: Hero) { this.selectedHero = hero; }
  gotoDetail() {
    this._router.navigate(['HeroDetail', { id: this.selectedHero.id }]);
  }
}

```

### Routing

### Services

### Pipes

### Animations

### Forms / Validation

### Angular Tool Belt

These are tools that will help you out.  Immensely.

* Augury
* Angular CLI
* Components
* Routing
* Services
* Animations
* Pipes (a.k.a Filters)
* TypeScript
* Decorators
* Forms and Validation
* Angular Universal
* ngRx
* StyleGuide / Codelyzer
* Docs
* Material

#### Docs

All of the Angular 2.0 docs can be found at [angular.io](https://angular.io).

I've found these to also be helpful:

* [API Docs](https://angular.io/docs/ts/latest/api/)
* [Guide through Angular 2 Land](https://angular.io/docs/ts/latest/guide/)
* [Angular 1 to 2 Reference](https://angular.io/docs/ts/latest/cookbook/a1-a2-quick-reference.html)

#### Augury

Formerly known as "Batarangle", Augury is the Chrome extension for Angular 2 apps that allows you to visual your component tree, state and router tree.

Before anything you should [Install Augury](https://chrome.google.com/webstore/detail/augury/elgalmkoelokbchhkhacckoklkejnhcd)

##### A quick tour of Augury

The team at Rangle.io built out a nice set of [examples](https://github.com/rangle/augury/tree/master/example-apps) that allows you to play with Augury.

1. `git clone https://github.com/rangle/augury.git`
2. `cd example-apps/kitchen-sink-example && npm install`
3. `npm start`
4. [Open DI Demo](http://localhost:8080/#/di-tree)
5. `Cmd + Option + i` (Bring up chrome tools)
6. Click the `Augury` tab
7. Click the `Injector Graph` tab
8. Select `Component5` on the left to see the injector graph for this component.
9. Click back to `Properties` and select `View Source` to see the TypeScript source file for this component.
10. Click back to the `Augury` tab and select `Router Tree`.


#### Angular CLI

[Angular CLI](https://cli.angular.io/) is a command-line-interface to create new apps, generate the things and serve your app up.

##### Install

```
npm install -g angular-cli
```

##### Single Liner - Create, Build and Serve

* `ng new angular-2-todo-app && cd angular-2-todo-app && ng serve`
* [http://localhost:4200](http://localhost:4200)

### Let's build an app!

#### 1. Create a Model

1. In `app/flex-item`, create a new file, let's name it `flex-item.model.ts`
2. Paste this into your new model:

```
export class FlexItem {
  name: string;
}
```

#### 2. Create a Service

`ng g service flex-item`

```
import { Injectable } from '@angular/core';
import { FlexItem } from './flex-item/flex-item.model';

@Injectable()
export class FlexItemService {
  getFlexItems() {
    const MOCK_FLEX_ITEMS: FlexItem[] = [
      { name: 'Flex Item 1' },
      { name: 'Flex Item 2' },
      { name: 'Flex Item 3' },
      { name: 'Flex Item 4' },
      { name: 'Flex Item 5' },
    ]

    return Promise.resolve(MOCK_FLEX_ITEMS);
  }
}
```

#### 3. Generate some components

* `ng g component flex-container`
* `ng g component flex-item`

#### 4. Update components to use Model and Service

##### how-to-flexbox.component.ts

```
import { Component } from '@angular/core';
// Import the flex-container component.
import { FlexContainerComponent } from './flex-container/flex-container.component'

@Component({
  moduleId: module.id,
  selector: 'how-to-flexbox-app',
  templateUrl: 'how-to-flexbox.component.html',
  styleUrls: ['how-to-flexbox.component.css'],
  // Allow the UI to use this component.
  directives: [FlexContainerComponent]
})
export class HowToFlexboxAppComponent { }
```

##### How to Flexbox Component


```
<app-flex-container></app-flex-container>
```


##### Flex Container Component

File: `flex-container.component.ts`

```
import { Component, OnInit } from '@angular/core';
import { FlexItemComponent } from '../flex-item/flex-item.component';
import { FlexItem } from '../flex-item/flex-item.model';
import { FlexItemService } from '../flex-item.service';

@Component({
  moduleId: module.id,
  selector: 'app-flex-container',
  templateUrl: 'flex-container.component.html',
  styleUrls: ['flex-container.component.css'],
  directives: [FlexItemComponent],
  providers: [FlexItemService]
})
export class FlexContainerComponent implements OnInit {
  flexItems: FlexItem[];

  constructor(private _flexItemService: FlexItemService) { }

  ngOnInit() {
    this._flexItemService.getFlexItems()
      .then(flexItems => this.flexItems = flexItems);
  }

}
```

File: `flex-container.component.html`


```
<ol class='flex-container'>
  <li *ngFor='let flexItem of flexItems'>
    <app-flex-item [flexItem]='flexItem'></app-flex-item>
  </li>
</ol>

```

##### Flex Item Component

File: `flex-item.component.ts`


```
import { Component, OnInit, Input } from '@angular/core';
import { FlexItem } from './flex-item.model';

@Component({
  moduleId: module.id,
  selector: 'app-flex-item',
  templateUrl: 'flex-item.component.html',
  styleUrls: ['flex-item.component.css']
})
export class FlexItemComponent implements OnInit {
  @Input() flexItem: FlexItem;

  constructor() {}

  ngOnInit() {
  }

}
```

File: `flex-item.component.html`

```
<div class='flex-item'>{{ flexItem.name }}</div>
```

### Add Styles

1. `npm install node-sass`
2. Rename .css files in your project to .scss or .sass. They will be compiled automatically.
