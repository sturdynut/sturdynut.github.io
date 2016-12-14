---
disqus: http://sturdynut.com/blog/nativescript-ng2-redux-brightwork.html
layout: post
background: "34.jpg"
title: "NativeScript ・ Angular 2 ・ Redux ・ BrightWork"
comments: true
tags:
  - nativescript
  - angular 2
  - redux
  - brightwork
---

# NativeScript ・ Angular 2 ・ Redux ・ BrightWork

## Gotchas - Things that make you 😩

When NativeScript attemps to load Redux, it will blow up and give you an error: `file:///app/tns_modules/redux/lib/index.js:38:12: JS ERROR ReferenceError: Can't find variable: process`. 
The only way I know around this right now is to just monkey-patch it.

```javascript

// Put this at the top of your main.ts
global.process = { env: {} };

```

Thank you @vakrilov for this.  See it [here](https://github.com/vakrilov/ng2-redux-nativescript/blob/master/app/main.ts)