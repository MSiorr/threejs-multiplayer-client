# Three.JS Multiplayer Client

Logic 1v1 game, written in Javascript and Three.js.

## Table of Contents
- [Introduction](#introduction)
- [Installation and setup](#installation-and-setup)
- [Features](#features)
- [Future Development](#future-development)

## Introduction
The main goal of this project is to create a 1v1 logic game available in browsers. The project was created as a school assignment.

Project works with conjunction with respective [backend server](https://github.com/PrivPolicy/threejs-multiplayer-server).

## Installation and setup
- Clone or download the repository
- `npm i` to install dependencies
- `npm run build` to build the project

This will create a `\dist` directory with all the necessary files; `index.html` is the entry point.

**Note:** project doesn't work when opened locally, you need to provide basic server capabilities to properly send the files.

## Features
- Randomly selected levels for you and your opponent with 3 difficulty levels
- Powerup system allowing to make the puzzle solving a little harder
- Matchmaking system
- Socket communication between clients and server
- Beautiful graphics and animations
- Basic level editor

## Future Development
There are no plans regarding future development of this project