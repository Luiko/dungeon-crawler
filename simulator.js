import { createStore } from "redux";
import reducer from './src/reducers';
import initial_state from './src/initial_state';
import { fightEnemy, pickHealth } from "./src/actions";

const { log } = console;
let store = createStore(reducer, initial_state)

log('Dungeon 1');

let state = store.getState();
let { health: { quantity: health }, attack, enemies, experience, dungeon } = state;
let enemy = enemies[0];
log('step 0 get state');
log('hero', { health, attack });
log('enemy', enemy);

const isObject = x => Object.prototype.isPrototypeOf(x);
log('step 1 fight ', enemy.id);
while (enemy && enemy.health >= 10) {
  health = state.health.quantity;
  enemies = state.enemies;
  store.dispatch(fightEnemy(health, attack, enemy, experience, dungeon));
  diff('fight', state, store.getState());
  state = store.getState();
  enemy = state.enemies.find(e => e.id === enemy.id);
}

log('hero get pick up health');
const { level } = store.getState().experience;
store.dispatch(pickHealth(level));
diff('pick up health', state, store.getState());
state = store.getState();

experience = state.experience;
enemies = state.enemies;
enemy = enemies[0];
log('step 3 walk to enemy');
log('hero', { health, attack });
log('enemy', enemy);

log('step 4 fight ', enemy.id);
while (enemy && enemy.health >= 10) {
  health = state.health.quantity;
  enemies = state.enemies;
  store.dispatch(fightEnemy(health, attack, enemy, experience, dungeon));
  diff('fight', state, store.getState());
  state = store.getState();
  enemy = state.enemies.find(e => e.id === enemy.id);
}

function diff(action, state, nextState) {
  log('before', action, foo(nextState, state, {}));
  log('after', foo(state, nextState, {}));
  function foo(node, node2, map) {
    if (!node) return node;
    const changedKeys = Object.keys(node).filter(k => node[k] != node2[k]);
    changedKeys.forEach((k) => {
      if (Array.isArray(node2[k])) {
        map[k] = [];
        map[k] = (foo(node[k], node2[k], map[k]));
      } else if(isObject(node2[k])) {
        map[k] = {};
        map[k] = foo(node[k], node2[k], map[k]);
      } else {
        map[k] = node2[k];
      }
    });
    if (Array.isArray(map)) {
      const hasNull = map.reduce((isNull, e) => isNull || e === undefined, false);
      map = hasNull? ['*object deleted*']: map;
    }
    return map;
  }
  return nextState;
}
