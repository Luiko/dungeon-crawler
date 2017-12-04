import maps from './lib/maps';
import weapons from './weapons';
import spitRandomUnrepeatable from './lib/Unrepeatable';

const whiteSpaces = maps[0].getEmptySpaces();
const hero = maps[0].getHero();
const cave = maps[0].getCave();
let enemies = maps[0].getEnemies();
const unreapeatable = spitRandomUnrepeatable(
  whiteSpaces,
  [hero, cave]
);

const health = whiteSpaces[unreapeatable.random()];
const weapon = weapon? whiteSpaces[unreapeatable.random()]: weapon;
enemies = enemies.map(() => whiteSpaces[unreapeatable.random()]);


export default {
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
    quantity: 100,
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
  boss: null,
  won: false
};
