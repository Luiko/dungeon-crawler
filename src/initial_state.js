import maps from './lib/maps';
import weapons from './weapons';

export default {
  hero: maps[0].getHero(),
  dungeon: 1,
  whiteSpaces: maps[0].getEmptySpaces(),
  cave: maps[0].getCave(),
  weapon: {
    point: maps[0].getWeapon(),
    name: weapons[0].name,
    index: 0
  },
  attack: 10,
  health: {
    quantity: 100,
    point: maps[0].getHealth()
  },
  enemies: maps[0].getEnemies().map((point, index) => ({
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
  boss: null,
  won: false
};
