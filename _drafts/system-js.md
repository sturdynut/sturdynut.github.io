---
disqus: http://sturdynut.com/blog/system-js.html
layout: post
background: "22.jpg"
title: "SystemJS"
comments: true
tags:
  - system-js
  - modules
  - module loaders
---

## SystemJS

We are going to learn SystemJS by using it.

### Basics

Let's create a new directory and `npm init`, defaults are all fine.

* `mkdir system-js-hello-world && cd $_`
* `npm init`

We need to install SystemJS and create an html page and an entry point.

* `npm install systemjs --save`
* `touch index.html`
* `touch main.js`

### Initial Setup

We need to do something in our `main.js` file, for now let's just output to the console.

*File :* `main.js`

```javascript
console.log('Hello World!');
```

First we need to include the `system.js` library and import our `main.js` file.  I also threw `lodash` in just to demonstrate importing an external file.  We'll use that later.

*File :* `index.html`

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>SystemJS Hello World</title>
</head>
<body>

    <script src="node_modules/systemjs/dist/system.js"></script>
    <script>
      System.import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js');
      System.import('main.js');
    </script>

</body>
</html>
```

*File :* `package.json`

Add a new command to your `scripts` section, just to make a simple http server.

```javascript
"scripts": {
  "serve": "python -m SimpleHTTPServer 9000"
},
```

#### Run it!

* `npm run serve`
* [http://localhost:9000](http://localhost:9000)

Open up your console and you should see "Hello World!".

### Add All The Modules!

One of the main things SystemJS offers us is the ability to load any kind of module, so let's create an AMD module and a CommonJS module.

**Create a new file, `amd-module.js`**

```javascript
define(function () {
  console.log('AMD Module was loaded!');
});
```

**Create a new file, `commonjs-module.js`**

```javascript
exports.default = function() {
  console.log('CommonJS module was loaded!');
};
```

**Create a new file, `es6-module.js`**

```javascript
export class es6Module {
  constructor() {
    console.log('ES6 Module was loaded!');
  }
}
```

Now, we need to import this diverse collection of modules.

*File :* `index.html`

```html
    <script>
      System.import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js');
      System.import('main.js');
      System.import('amd-module.js');
      System.import('commonjs-module.js').then(function(m) {
        new m.default();
      });
      System.import('es6-module.js').then(function(m) {
        new m.es6Module();
      });
    </script>
```

#### A Note about ES6 Modules

In order to use ES6, we will have to use a transpiler to transpile the ES6 to ES5, so it can be ran in your favorite browser.

To do this, we will install [Traceur](https://github.com/google/traceur-compiler/).

1.  `npm install traceur --save-dev`
2.  Lastly, we need to config SystemJS to use Traceur:

*File :* `index.html`

```html
    <script>
      System.config({
        transpiler: 'traceur',
        map: {
          traceur: 'node_modules/traceur/bin/traceur.js'
        }
      });
      ...
    </script>
```

### Refresh!

After refreshing your browser, you should see something like this:

![image]('images/posts/systemjs/console.png')


