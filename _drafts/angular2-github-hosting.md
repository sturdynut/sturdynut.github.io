---
disqus: http://sturdynut.com/blog/angular-2-github-hosted.html
layout: post
background: "13.jpg"
title: "Angular 2 - GitHub Pages with Hosting"
comments: true
tags:
  - angular
  - github pages
  - hosting
---

## This can be a B*TCH

Allow me to save you about 12 hours of your life.

## 1) Project Setup

This is going to pick up where I left off on my [Angular CLI](http://sturdynut.com/2016/07/22/angular-cli/) post.  So,
if you haven't checked that out, go do it now.  Then come back here!

## 2) Deploy to GitHub

From the terminal, run the following to deploy your project.

*Make sure you are working from your project root.*

`ng github-pages:deploy --message="deploy to github pages"`

You know it was successful because you will be able to go to your project's site, which for me is [https://sturdynut.github.io/how-to-flexbox/](https://sturdynut.github.io/how-to-flexbox/).

### Errors

If you get something like... 

* `Error: ENOTEMPTY: directory not empty, rmdir '/some/path/to/your/dist/'`
	* Kill your `/dist` and re-run it, i.e. `rm -rf dist && ng github-pages:deploy --message="deploy to github pages"`
* `Error: Command failed: /bin/sh -c git push origin gh-pages:gh-pages ... error: failed to push some refs to ...`
    * Force the update to your gh-pages branch by: `git checkout gh-pages && git push -f`
    
## 3) Hosting / DNS

Depending on who your hosting provider is, this may vary, I am using 1 and 1.

