import maps from './lib/maps';
import weapons from './weapons';
import Unrepeatable from './lib/Unrepeatable';

export function getInitialState(random_spawn) {
  const whiteSpaces = maps[0].getEmptySpaces();
  const hero = maps[0].getHero();
  const cave = maps[0].getCave();
  let boss = maps[0].getBoss();
  let weapon = maps[0].getWeapon();
  let health = maps[0].getHealth();
  let enemies = maps[0].getEnemies();
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

  return {
    hero,
    dungeon: 1,
    whiteSpaces,
    cave,
    weapon: {
      point: weapon,
      name: weapons[0].name,
      index: 0
    },
    attack: 10,
    health: {
      quantity: 80,
      point: health
    },
    enemies: enemies.map((point, index) => ({
      id: 'enemy#' + (index + 1),
      health: 40 + 10 * Math.ceil(Math.random() * 3),
      point
    })),
    experience: {
      level: 1,
      levelup: 80,
      total: 0
    },
    game_over: false,
    boss,
    won: false,
    random_spawn
  };
}

export default getInitialState(true);
