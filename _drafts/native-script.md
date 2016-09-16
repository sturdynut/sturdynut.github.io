---
disqus: http://sturdynut.com/blog/native-script.html
layout: post
background: "17.jpg"
title: "Native Script"
comments: true
tags:
  - nativescript
  - angular 2
---

## NativeScript, Angular2 and Firebase

Yet another Javascript solution for building cross-platform, native apps.  But, does it work?  Is it easy to use?  Are there any gotchas?  We'll soon find out...

### Digging In

To get started, you should [Start Here](http://docs.nativescript.org/angular/start/quick-setup).

Once you install everything, test it out!

1.  Create a new project `tns create hello-world --ng`
2.  `cd hello-world && tns platform add ios`
3.  `tns run ios --emulator`

### Gotchas

* If you get something like this: `require': cannot load such file -- xcodeproj (LoadError)`
  * You are missing a ruby gem called xcodeproj.  It is required in order to build ios projects.

**Fix: ** `[sudo] gem install xcodeproj` [Source](https://github.com/NativeScript/ios-runtime/issues/613)

* If you get something like this: `TypeError: _this.cssClasses(view).set is not a function`

**Fix: **

1. `tns plugin remove tns-core-modules`
2. `tns plugin add tns-core-modules@2.2.0`
3. `tns plugin remove nativescript-angular`
4. `tns plugin add nativescript-angular@0.3.0`

[Source](http://stackoverflow.com/questions/38906245/nativescript-2-2-exception)

### Let's Build Something

While we build something, you will want to start reading through Chapter 2 of the NativeScript tutorial.  I wouldn't read it all right now, but it would be good to familiarize yourself with the directory structure and how the app is started up.

[Chapter 2](http://docs.nativescript.org/angular/tutorial/ng-chapter-2)

While we are writing code, it would be nice to not have to stop and run the app everytime we make a change, so let's `control + c` to kill the simulator and restart it using the command below, note that `--watch` flag.  Now the app will refresh anytime we make a change.

`tns livesync ios --emulator --watch`

#### Data Storage

We are going to use a the [NativeScript SQLite plugin](https://github.com/NathanaelA/nativescript-sqlite)

`tns plugin add nativescript-sqlite`


