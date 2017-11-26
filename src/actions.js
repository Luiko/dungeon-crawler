import maps from './lib/maps';
import weapons from './weapons';
import deepEqual from 'fast-deep-equal';
import initalState from './initial_state';

export const MOVE_TOP = 'MOVE_TOP';
export const MOVE_RIGHT = 'MOVE_RIGHT'
export const MOVE_BOTTOM = 'MOVE_BOTTOM';
export const MOVE_LEFT = 'MOVE_LEFT';
export const PASS_DUNGEON = 'PASS_DUNGEON';
export const PICK_WEAPON = 'PICK_WEAPON';
export const PICK_HEALTH = 'PICK_HEALTH';
export const FIGHT_ENEMIES = 'FIGHT_ENEMIES';
export const LEVELUP = 'LEVELUP';
export const RESTART = 'RESTART';

export const moveTop = y => ({
  type: MOVE_TOP,
  y: y - 1
});

export const moveRight = x => ({
  type: MOVE_RIGHT,
  x: x + 1
});

export const moveBottom = y => ({
  type: MOVE_BOTTOM,
  y: y + 1
});

export const moveLeft = x => ({
  type: MOVE_LEFT,
  x: x - 1
});

export const passDungeon = (dungeon) => ({
  type: PASS_DUNGEON,
  dungeon: dungeon + 1,
  hero: maps[dungeon].getHero(),
  whiteSpaces: maps[dungeon].getEmptySpaces(),
  cave: maps[dungeon].getCave(),
  weapon: maps[dungeon].getWeapon(),
  health: maps[dungeon].getHealth(),
  enemies: maps[dungeon].getEnemies().map((point, index) => ({
    id: 'enemy#' + index + 1,
    health: 40 * (dungeon + 1) + 10 * Math.ceil(Math.random() * 3),
    point
  })),
  boss: {
    point: maps[dungeon].getBoss()
  }
});

export const pickWeapon = ({ index }) => ({
  type: PICK_WEAPON,
  name: weapons[index + 1].name,
  index: index + 1,
  point: null,
  attack: 15 + index * 15 + Math.round(Math.random() * (15 + index * 5))
});

export const pickHealth = (level) => ({
  type: PICK_HEALTH,
  health: level * 20 + Math.ceil(Math.random() * (2 + level)) * 10,
  point: null
});

function sustrgtz(a, b) {
  const sustr = a - b;
  return Math.max(sustr, 0);
} 

//hero fight with enemies, vanish enemies, get experience, levelup,
export function _fight(health, attack, enemies, point, dungeon, experience) {
  const enemy = enemies.find(e => deepEqual(e.point, point));
  const nextEnemies = enemies.map(e => {
    const newE = { health: sustrgtz(e.health, attack, dungeon) };
    const thisIs = e.id === enemy.id;
    if (thisIs && newE.health > 0) {
      return Object.assign({}, e, newE);
    } else if (thisIs) {
      return null;
    }
    return e;
  }).filter(e => e !== null)
  let current = enemies.length === nextEnemies.length? experience.current :
    experience.current + dungeon * 40;
  let { level, levelup } = experience;
  if (current >= experience.levelup) {
    current -= experience.levelup;
    level = experience.level + 1;
    levelup = experience.levelup * 3;
  }
  const payload = {
    health: sustrgtz(health.quantity, Math.pow(dungeon + 1, 3)),
    enemies: nextEnemies,
    experience: {
      level,
      levelup,
      current
    }
  };
  return payload;
}

export const fightEnemies = (health, attack, enemies, point, dungeon, experience) => ({
  type: FIGHT_ENEMIES,
  payload: _fight(health, attack, enemies, point, dungeon, experience)
});

export const levelup = (index, level) => ({
  type: LEVELUP,
  name: weapons[index + 1].name,
  index: index + 1,
  attack: 15 + index * 15 + Math.round(Math.random() * (15 + index * 5)),
  health: level * (15 +  Math.round(Math.random() * 5))
});

export const restart = () => Object.assign({ type: RESTART }, initalState);
