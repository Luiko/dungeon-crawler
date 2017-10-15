# Personal boilerplate setup for React SPA

## Prerequisites
* know git, node, npm, react, sass, unit testing

## Usage
1. clone repository

 `git clone https://github.com/Luiko/apps-setup`

2. open folder

  `cd apps-setup`

3. create new orphan branch

  `git checkout --orphan new-app`

4. reset filest and make modifications on your git repository

  `git reset`

5. commit files

  `git commit -m "initial commit"`

6. restart full repository
  
  `git checkout master`
  
  `git rebase new-app`

(if asked)`git rebase --skip`
  
`git branch -d new-app`

## Instalation
`npm install`
`npm run build`

## Development
`npm test`
`node server.test.js`
`npm run dev`
`npm run hot`

## Manual Modification
### Files
* index.html
* package.json
* package-lock.json
* LICENSE
* README.md
* add* .env

### Properties
* app name
* app description
* semver
* author name
* repository
* title
* reference docs

### Dependencies that relieves warnings
react-test-renderer for tape/enzyme unit testing

json-loader for load json with webpack

# Roguelike Dungeon Crawler Game

## Installation

## Development

## User Stories
* I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.
* All the items and enemies on the map are arranged at random.
* I can move throughout a map, discovering items.
* I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.
* Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.
* When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.
* When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.
* When I find and beat the boss, I win.
* The game should be challenging, but theoretically winnable.
