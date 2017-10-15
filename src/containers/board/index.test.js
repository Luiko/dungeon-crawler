// import React from 'react';
import test from 'tape';
// import { shallow } from 'enzyme';
// import Board from './index';
import { collition } from './index';

// test('React application', t => {
//   t.plan(2);
//   const wrapper = shallow(<Board/>);
//   t.true(wrapper.exists(), 'React application exists');
//   t.equal(wrapper.find('p').text(), 'Hello World', 'Has a pragraph with text');
// });

function point(x, y) {
  return { x, y };
}

test('collition wall', t => {
  t.plan(1);
  const prevState = {
    hero: {
      x: 3,
      y: 3
    },
    whiteSpaces: [
      point(2, 3), point(3, 3), point(4, 3)
    ],
    enemies: []
  }
  const action = {
    type: 'MOVE_TOP',
    y: 4
  }
  const actual = collition(prevState, action);
  t.false(actual, 'should return false');
});

test('collition empty space', t => {
  t.plan(1);
  const prevState = {
    hero: {
      x: 3,
      y: 3
    },
    whiteSpaces: [
      point(3, 2),
      point(3, 3), point(4, 3),
      point(4, 4), point(5, 4)
    ],
    enemies: []
  }
  const action = {
    type: 'MOVE_TOP',
    y: 2
  }
  const actual = collition(prevState, action);
  const expected = { x: 3, y: 2 };
  t.deepEqual(actual, expected, 'should return point object');
});

test('collition enemy', t => {
  t.plan(1);
  const prevState = {
    hero: {
      x: 3,
      y: 3
    },
    whiteSpaces: [
      point(3, 2),
      point(3, 3), point(4, 3),
      point(3, 4)
    ],
    enemies: [point(3, 2), point(3, 4)]
  };
  const action = {
    type: 'MOVE_TOP',
    y: 2
  };
  const actual = collition(prevState, action);
  t.false(actual, 'should return false');
});

test('collition enemy dodged', t => {
  t.plan(1);
  const prevState = {
    hero: {
      x: 3,
      y: 3
    },
    whiteSpaces: [
      point(3, 2),
      point(3, 3), point(4, 3),
      point(3, 4)
    ],
    enemies: [point(3, 4)]
  };
  const action = {
    type: 'MOVE_TOP',
    y: 2
  };
  const actual = collition(prevState, action);
  const expected = point(3,2);
  t.deepEqual(actual, expected, 'should return point object');
});
