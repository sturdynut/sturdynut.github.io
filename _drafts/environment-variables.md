---
disqus: http://sturdynut.com/blog/environment-variables.html
layout: post
background: "4.jpg"
title: "Banging Your Head Against a Wall: Environment Variables"
author: Matti Salokangas
comments: true
tags:
  - software development
  - environment variables
---

Ever spent all day trying to fix one thing?  It can be the most frustrating and deflating experience.
I have recently had one of those days and wanted to share what happened so this doesn't happen to you.

## What I Was Doing

I was trying to run specs via `RAILS_ENV=test rspec`.  Pretty straight forward, right?

## The Issue

The rails app I was working on uses webpacker to compile assets.  When running in a test environment, these assets are compiled
to a `public/packs-test` directory.  The `packs-test` directory is required in order to run the specs, so if it is missing, things go 💥!  Well, this `packs-test` folder was
not being created by webpacker, so my specs were all failing.  😭

## The Order of the Environment Variables

Before we dive into what I discoverd.  Let's review the order of precedence for environment variables...

_Things are of course a little different between Windows, OSX and Linux environments.  The list below is based on OSX/Linux, but I did want to mention a bit more on Windows Environment Variables._

### Windows

Windows has a slight different order of environment variables:

- System: All Users
- User: Specific Users
- Process: Specific Process
- Volatile: Current logon session only

Let's just consider all of these to be "System" in the order section below for simplicity.

### The Order

This is how I imaged the order of environment variables.  Essentially, "Command Line" will override "Zsh/Bash Shell Defaults" which will in turn override "System" level environment variables.

1) System
  - These are the system default environment variables, like `PATH`

2) Shell Defaults
  - Set in `~/.bash_profile` or `~/.zshrc`...etc
  - Set by adding `export FOO_BAR=test` to your file.
  - Loaded when you start up your terminal.
  - Will persist in all shells, similar to system level.

3) Shell Session
  - Set in command line.
  - Set by typing `export FOO_BAR=test` in your terminal.
  - Will persist in current shell and subsequent commands will inherit value.

4) Environment Files
  - Set in `.env`, `.env.test`, etc.
  - Set by adding `FOO_BAR=test` to your .env file.
  - Requires 3rd party load .env files, e.g. "dotenv" packages for rails, javascript
  - Will override system, bash profile and shell session level environment variables.

5) Command Line
  - Example: `FOO_BAR=test yarn start`
  - Will persist in current command only

_Tip: To view all your environment variables you can use `set` or `printenv` (osx/linux only)_

### The Order Lies!

Turns out, the way I was thinking about environment variables was wrong.

Although in most scenarios this order is true because of the typical sequence of operations, for example:

1) System environment variables are loaded by default when you start up your computer.

2) Shell defaults are loaded when you start your shell

3) Environment file overrides are loaded when you start your app

4) Environment variable is set via command, e.g. `RAILS_ENV=test rspec`

So, rather than thinking of environment variables as hierarchical order, a more accurate way of thinking about environment variables is that the last one set is the one used.  It could be from the command line or from your bash profile or from setting it in your shell.

To demonstrate, let's consider that `FOO_BAR` is a standard environment variable defaulted to `BAZ` on every laptop.

- `echo $FOO_BAR` outputs `BAZ`

**Overriding with Shell Session**

- `export FOO_BAR=1`
- `echo $FOO_BAR` now outputs `1`

**Overriding with Command Line**

- `FOO_BAR=2 && echo $FOO_BAR`
- `echo $FOO_BAR` now outputs `2`

_Question: What would happen here?_
- `export FOO_BAR=1`
- `FOO_BAR=2 echo $FOO_BAR`

_Question: What about here?_
- `export FOO_BAR=3` (Update in `~/.zshrc`)
- `export FOO_BAR=1` (Ran in command line)
- `source ~/.zshrc`
- `echo $FOO_BAR`

## What was actually wrong?

I had a `.env.test` file with `RAILS_ENV=` in it, which was overriding my `RAILS_ENV` passed in via command line.  This is obviously not what was expected
and I did not consider it because in my head I had already ruled it out.  Shouldn't the `RAILS_ENV` that I pass into the command line always override? _Answer: nope!_

Turns out, the heart of the issue was that I did not realize how we were using the dotenv gem.  When using the dotenv gem, you can load `.env` files via `overload` or `load`.  The major difference between these two is that `overload` will override any existing environment variables set!  Yes, you guessed it...we were using the `overload` method in the `test` environment, which in turn was overriding what I was passing in to the command line! 😳

To fix, I just removed `RAILS_ENV` from the `.env.test` file and then everything worked. 🎉

## Key Takeaways

When you are hitting a wall...

### Be Aware of Your Assumptions

Keep an open mind and question your assumptions.  It can be hard to even be aware of them, so do what you can to get out of the 🤬 headspace.

### Environment Variables Can Be Trixy

Environment variables can be loaded in a myriad of ways and sometimes in unexpected ways.

Be aware that the dotenv gem will override your environment variables if using the `overload` method!

### Never Give Up

This has been the single-most important thing I have adopted.  No matter how frustrated you are or how hopeless you feel,
do not give up.  More often than not you are just at the crest of the hill, just keep going!
