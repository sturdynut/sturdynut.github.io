---
disqus: http://sturdynut.com/blog/react-native.html
layout: post
background: "7.jpg"
title: "React Native"
comments: true
tags:
  - react native
  - react
---

## React Native

This is what got me.


> You build a real mobile app that's indistinguishable from an app built using Objective-C or Java...React Native wraps native controls like UIScrollView or UIImageView, which gives you the performance of a native app, plus the clean design of React. [source](https://facebook.github.io/react-native/)

This is exactly what I want.  Here are some other really cool things.

* You can include native code with your React code.
  * `import { TheGreatestComponentInTheWorld } from './your-native-code';`
* Hot reloading is baked it so you have quick build cycles.  #WINNING
* Facebook uses it, so its gotta be great right?

### Digging In

To get started, you should start [here](https://facebook.github.io/react-native/docs/getting-started.html#content).

Once you install everything, test it out!

1. `react-native init AwesomeProject --verbose`
2. `cd AwesomeProject && react-native run-ios`

_You may notice that this runs for a long time.  There's even bugs open because it takes so dam long.  So, this is kinda a bummer, but just sit tight, it'll be over soon._


`ps aux | grep Simulator`