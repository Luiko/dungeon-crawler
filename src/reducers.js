import { combineReducers } from 'redux';

import {
  MOVE_TOP, MOVE_RIGHT, MOVE_BOTTOM, MOVE_LEFT, PASS_DUNGEON, PICK_HEALTH,
  PICK_WEAPON, LEVELUP, FIGHT_ENEMIES, RESTART, FIGHT_BOSS
} from './actions';

const reducer = combineReducers({
  hero, dungeon, whiteSpaces, cave, weapon, attack, health, enemies,
  experience, game_over, boss
});

export default reducer;

function hero(state = { x: null, y: null }, action) {
  switch (action.type) {
    case MOVE_TOP:
    case MOVE_RIGHT:
    case MOVE_BOTTOM:
    case MOVE_LEFT:
      const obj = action.x? { x: action.x } : { y: action.y };
      return Object.assign({}, state, obj);
    case PASS_DUNGEON:
    case RESTART:
      return action.hero;
    default:
      return state;
  }
}

function dungeon(state = 1, action) {
  switch (action.type) {
    case PASS_DUNGEON:
    case RESTART:
      return action.dungeon;
    default:
      return state;
  }
}

function whiteSpaces(state = null, action) {
  switch (action.type) {
    case PASS_DUNGEON:
    case RESTART:
      return action.whiteSpaces;
    default:
      return state;
  }
}

function cave(state = null, action) {
  switch (action.type) {
    case PASS_DUNGEON:
    case RESTART:
      return action.cave;
    default:
      return state;
  }
}

function weapon(state = null, { type, point, name, index, weapon}) {
  switch (type) {
    case PICK_WEAPON:
      return Object.assign({}, state, { point, name, index });
    case LEVELUP:
      return Object.assign({}, state, { name, index });
    case PASS_DUNGEON:
      return Object.assign({}, state, { point: weapon });
    case RESTART:
      return weapon;
    default:
      return state;
  }
}

function attack(state = 0, action) {
  switch (action.type) {
    case PICK_WEAPON:
    case LEVELUP:
      return state + action.attack;
    case RESTART:
      return action.attack;
    default:
     return state;
  }
}

function health(state = null, action) {
  switch (action.type) {
    case PICK_HEALTH:
      return Object.assign({}, state, {
        quantity: state.quantity + action.health,
        point: null
      });
    case PASS_DUNGEON:
      return Object.assign({}, state, { point: action.health });
    case FIGHT_ENEMIES:
    case FIGHT_BOSS:
      return Object.assign({}, state, { quantity: action.payload.health });
    case LEVELUP:
      return Object.assign({}, state, {
        quantity: state.quantity + action.health
      });
    case RESTART:
      return action.health;
    default:
      return state;
  }
}

function enemies(state = null, action) {
switch (action.type) {
    case PASS_DUNGEON:
    case RESTART:
      return action.enemies;
    case FIGHT_ENEMIES:
      return action.payload.enemies;
    default:
      return state;
  }
}

function experience(state = null, action) {
  switch (action.type) {
    case FIGHT_ENEMIES:
      return action.payload.experience;
    case RESTART:
      return action.experience;
    default:
      return state;
  }
}

function game_over(state = false, action) {
  switch (action.type) {
    case FIGHT_ENEMIES:
    case FIGHT_BOSS:
      return action.payload.health === 0;
    case RESTART:
      return action.game_over;
    default:
      return state;
  }
}

function boss(state = null, action) {
  switch (action.type) {
    case PASS_DUNGEON:
      return action.boss;
    case FIGHT_BOSS:
      return action.payload.boss;
    default:
      return state;
  }
}
