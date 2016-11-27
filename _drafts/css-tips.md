---
disqus: http://sturdynut.com/blog/css-3-takeaways.html
layout: post
background: "31.jpg"
title: "CSS 3 Takeaways"
comments: true
tags:
  - css3
  - abookapart
---

## CSS 3 Takeaways

### Critical vs Non-Critical CSS Usage

* In critical areas of your web site, such as branding, usability, accessibility and layout
stick to fully supported css.
* In non-critical areas, such as interaction, visual rewards, feedback or movement don't be
afraid to use the bleeding edge.

### Tips & Tricks

* Provide a `color: #333` prior to your `color: rgba(0, 0, 0, 0.3)`.
* Use `transform` to avoid effecting surrounding elements.
* Use multiple background images for simple parallax effects.
* Provide a fallback `background-image` if using multiple background images.

```css
body {
  background-image: url('images/bg.png') no-repeat;
  background-image: url('images/layer-2.png') no-repeat,
    url('images/layer-1.png') no-repeat,
    url('images/bg.png') no-repeat;
  background-color: #333;
}
```