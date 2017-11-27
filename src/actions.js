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
export const FIGHT_BOSS = 'FIGHT_BOSS';

//balance stats
const upgradeAttack = (index) => 15 + Math.round(Math.random()
  * (5 + index * 4))
;
const pickEnemyHealth = (dungeon) => (65 * dungeon)
  + (20 * Math.ceil(Math.random() * 4))
;
const upgradePickHealth = (level) => level * 14 + Math.ceil(Math.random()
  * (2 + level)) * 10
;

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
    health: pickEnemyHealth(dungeon),
    point
  })),
  boss: {
    health: 400,
    attack: 50,
    point: maps[dungeon].getBoss()
  }
});

export const pickWeapon = ({ index }) => ({
  type: PICK_WEAPON,
  name: weapons[index + 1].name,
  index: index + 1,
  point: null,
  attack: upgradeAttack(index)
});

export const pickHealth = (level) => ({
  type: PICK_HEALTH,
  health: upgradePickHealth(level),
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
    experience.current + dungeon * 65;
  let { level, levelup } = experience;
  if (current >= experience.levelup) {
    current -= experience.levelup;
    level = experience.level + 1;
    levelup =  Math.round(experience.levelup * 2.6);
  }
  const enemyDamage = dungeon * 6 + Math.round(Math.random() * 2) * dungeon;
  const payload = {
    health: sustrgtz(health.quantity, enemyDamage),
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

export const fightBoss = (health, attack, boss) => {
  const newBossHealth = sustrgtz(boss.health, attack);
  const _boss = Object.assign({}, boss, { health: newBossHealth });
  return {
    type: FIGHT_BOSS,
    payload: {
      health: sustrgtz(health.quantity, boss.attack),
      boss: newBossHealth > 0? _boss : null
    }
  };
};

export const levelup = (index, level) => ({
  type: LEVELUP,
  name: weapons[index + 1].name,
  index: index + 1,
  attack: upgradeAttack(index),
  health: upgradePickHealth(level)
});

export const restart = () => Object.assign({ type: RESTART }, initalState);
