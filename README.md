[![GitHub package.json version](https://img.shields.io/github/package-json/v/reactgular/bookmarks.svg)](https://github.com/reactgular/bookmarks/releases)
[![GitHub issues](https://img.shields.io/github/issues/reactgular/bookmarks.svg)](https://github.com/reactgular/bookmarks/issues) 
[![GitHub last commit](https://img.shields.io/github/last-commit/reactgular/bookmarks.svg)](https://github.com/reactgular/bookmarks/commits/master)
![GitHub](https://img.shields.io/github/license/reactgular/bookmarks.svg)
[![GitHub stars](https://img.shields.io/github/stars/reactgular/bookmarks.svg?style=social)](http://github.com/reactgular/bookmarks)

# What is Bookmarks?

Bookmarks is a free web application that allows you to organize your
favorite URLs into neatly placed cards that are stored in multiple documents.

## Why was Bookmarks created?

It is one of several planned projects that will demonstrate my passion for front-end
development with real-world working examples. If you find this project interested, 
then visit [Reactgular](https://reactgular.com) to discover other projects.

## Source Code

You can download a Zip file of the [source code](https://github.com/reactgular/bookmarks/archive/master.zip) but it is better to follow
the installation instructions below, and run the application locally. 

## Installation

You can download and run this app on your local computer easily. The only 
prerequisite is that you install [NodeJS](https://nodejs.org/) which can 
be done by following the instructions on their website.

The demo can be installed and run by following these commands.

```bash
git clone https://github.com/reactgular/bookmarks.git
cd bookmarks
npm install
ng serve --open
```

> Note: Bookmarks makes HTTP requests to https://api.bookmarks.reactgular.com for HTML meta data.

## Session Storage

This web application is designed to use the browser's local storage for persisting
data when you return in the future. There is no **authentication** or **security**
for any of the URLs stored in this web application.  

## Dependencies

The following technologies and libraries were used in the creation of this project.
Most of what you see here was custom programmed by myself, but I also leverage some
of the best and most popular dependencies.

- [Angular](https://angular.io) as the front-end framework.
- [Material Design](https://material.angular.io) as a UI component library.
- [NgXS](https://ngxs.gitbook.io/ngxs/) for state management.
- [FontAwesome](https://fontawesome.com/icons) for the icons.
- [Bootstrap](https://getbootstrap.com/) for the CSS styles and utilities.
