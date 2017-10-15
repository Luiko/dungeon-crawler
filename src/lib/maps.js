function getWidth(maps, index) {
  let num;
  switch (index) {
    case 0:
      num = 13;
      break;
    case 1:
      num = 18;
      break;
    default:
      throw Error;
  }
  return maps[index].length / num;
}

function getHeight(index) {
  switch (index) {
    case 0:
      return 13;
    case 1:
      return 18;
    default:
      return 0;
  }
}

function getEmptySpaces(maps, index, width) {
  const map = maps[index];
  const getPositionIfIsEmpty = (arr, value, i) => {
    if (value !== 'o') arr.push(i);
    return arr;
  };
  const emptySpaces = map.split('').reduce(getPositionIfIsEmpty, []);
  const getPointOfPosition = position => {
    const y = Math.floor(position / width);
    return {
      x: position + (-1 * (y * width)),
      y
    };
  };
  return emptySpaces.map(getPointOfPosition);
}

function findItem(maps, index, width, item) {
  const map = maps[index];
  const indexToPoint = (obj, value, i) => {
    if (value === item) {
      const y = Math.floor(i / width);
      return {
        x: i + (-1 * (y * width)),
        y
      }
    }
    return obj;
  };
  return map.split('').reduce(indexToPoint, {});
}

function getHero(maps, index, width) {
  return findItem(maps, index, width, 'h');
}

function getCave(maps, index, width) {
  return findItem(maps, index, width, 'c');
}

function getWeapon(maps, index, width) {
  return findItem(maps, index, width, 'w');
}

function getHealth(maps, index, width) {
  return findItem(maps, index, width, 'l');
}

function getEnemies(maps, index, width) {
  const map = maps[index];
  const indexToPoint = (arr, value, i) => {
    if (value === 'e') {
      const y = Math.floor(i / width);
      return [...arr, {
        x: i + (-1 * (y * width)),
        y
      }];
    }
    return arr;
  };
  return map.split('').reduce(indexToPoint, []);
}

let maps = [
  'oooooooooooooooooooooooooooooooooooooo' +
  'ooo h     oooooooooooooooooooooooooooo' +
  'ooo       oooooooooooooooooooooooooooo' +
  'ooo    e       c    oooooooooooooooooo' +
  'ooo                 oooooooooooooooooo' +
  'ooooooooooooooooooo oooooooooooooooooo' +
  'ooooooooooooooooooo oooooooooooooooooo' +
  'ooooo       ooooooo oooooooooooooooooo' +
  'ooooo e     ooooooo    l   ooooooooooo' +
  'ooooo                      ooooooooooo' +
  'ooooo       ooooooo    w   ooooooooooo' +
  'ooooooooooooooooooo        ooooooooooo' +
  'oooooooooooooooooooooooooooooooooooooo',
  'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
  'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooo                    c     w                                    oo' +
  'oooooooo      e       oo ooooooooooooooooooooooooooooooooo             oo' +
  'oooooooo          l   oo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooo  h           oo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'oooooooooooooooooooooooo oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'ooooooooooooo            oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'ooooooooooooo  e         oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'ooooooooooooo            oooooooooooooooooooooooooooooooooooooooooooooooo' +
  'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' +
  'ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
];

const eachMapWithItsMethods = (map, index, maps) => {
  const width = getWidth(maps, index);
  return {
    map,
    getWidth: getWidth.bind(null, maps, index),
    getHeight: getHeight.bind(null, index),
    getEmptySpaces: getEmptySpaces.bind(null, maps, index, width),
    getHero: getHero.bind(null, maps, index, width),
    getCave: getCave.bind(null, maps, index, width),
    getWeapon: getWeapon.bind(null, maps, index, width),
    getHealth: getHealth.bind(null, maps, index, width),
    // getEnemies: function (dungeon) {
    //   return getEnemies(maps, index, width, dungeon)
    // }
    getEnemies: getEnemies.bind(null, maps, index, width)
  };
};

export default maps = maps.map(eachMapWithItsMethods);
