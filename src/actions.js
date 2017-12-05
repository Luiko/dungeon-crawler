import maps from './lib/maps';
import weapons from './weapons';
import { getInitialState } from './initial_state';
import Unrepeatable from './lib/Unrepeatable';

export const MOVE_TOP = 'MOVE_TOP';
export const MOVE_RIGHT = 'MOVE_RIGHT'
export const MOVE_BOTTOM = 'MOVE_BOTTOM';
export const MOVE_LEFT = 'MOVE_LEFT';
export const PASS_DUNGEON = 'PASS_DUNGEON';
export const PICK_WEAPON = 'PICK_WEAPON';
export const PICK_HEALTH = 'PICK_HEALTH';
export const FIGHT_ENEMY = 'FIGHT_ENEMY';
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
  * (2 + level)) * 12
;
export const enemyDamage = (dungeon) => (dungeon * 6) +
  (Math.round(Math.random() * 2) * dungeon)
;
export const beatEnemyExperience = (dungeon, experience) => experience
  + dungeon * 65
;
const upgradeLvlup = (levelup) => Math.round(levelup * 2.6);

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

export const passDungeon = (dungeon, random_spawn) => {
  const whiteSpaces = maps[dungeon].getEmptySpaces();
  const hero = maps[dungeon].getHero();
  const cave = maps[dungeon].getCave();
  let boss = maps[dungeon].getBoss();
  let weapon = maps[dungeon].getWeapon();
  let health = maps[dungeon].getHealth();
  let enemies = maps[dungeon].getEnemies();
  if (random_spawn) {
    const unrepeatable = Unrepeatable(whiteSpaces, [hero, cave].filter(e => e));
    weapon = whiteSpaces[unrepeatable.random()];
    health = whiteSpaces[unrepeatable.random()];
    enemies = enemies.map(() => whiteSpaces[unrepeatable.random()]);
  }
  if (boss) {
    boss = {
      health: 400,
      attack: 50,
      point: boss
    };
  }
  return ({
    type: PASS_DUNGEON,
    dungeon: dungeon + 1,
    hero,
    whiteSpaces,
    cave,
    weapon,
    health,
    enemies: enemies.map((point, index) => ({
      id: 'enemy#' + index + 1,
      health: pickEnemyHealth(dungeon),
      point
    })),
    boss
  });
};

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

export function fightEnemy(health, attack, enemy, experience, dungeon) {
  const { id, health: eHealth } = enemy;
  const _enemy = { id, health: Math.max(eHealth - attack, 0) };
  const newExperience = beatEnemyExperience(dungeon, experience.total);
  const enemyDefeated = _enemy.health === 0;
  const levelup = enemyDefeated && newExperience >= experience.levelup;
  let _experience;
  if (enemyDefeated) {
    if (levelup) {
      _experience = {
        total: newExperience,
        levelup: upgradeLvlup(experience.levelup),
        level: experience.level + 1
      };
    } else {
      _experience = {
        total: newExperience,
        levelup: experience.levelup,
        level: experience.level
      };
    }
  } else {
    _experience = experience;
  }
  return {
    type: FIGHT_ENEMY,
    payload: {
      health: Math.max(health - enemyDamage(dungeon), 0),
      enemy: _enemy,
      experience: _experience
    }
  }
}

export const fightBoss = (health, attack, boss) => {
  const newBossHealth = Math.max(boss.health - attack, 0);
  const _boss = Object.assign({}, boss, { health: newBossHealth });
  return {
    type: FIGHT_BOSS,
    payload: {
      health: Math.max(health - boss.attack, 0),
      boss: _boss
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

export const restart = (random) => Object.assign({ type: RESTART }, getInitialState(random));

