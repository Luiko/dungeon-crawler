import test from 'tape';
import maps from './maps';

test('map 1', t => {
  t.plan(9);
  const map = maps[0];
  t.false(Array.isArray(map.map), 'has not an array');
  t.equal(typeof map.map, 'string', 'has a string');
  t.equal(typeof map.getWidth, 'function', 'has a function called getWith');
  t.equal(typeof map.getHeight, 'function', 'has a function called getHeight');
  t.equal(map.getWidth(), 38, 'width is 38');
  t.equal(map.getHeight(), 12, 'height is 12');
  t.true(Array.isArray(map.getEmptySpaces()), 'got array of empty spaces');
  t.equal(map.getEmptySpaces().length, 59, 'has 59 points with empty space');
  t.deepEqual(map.getHero(), { x: 4, y: 1 }, 'has a hero');
});
