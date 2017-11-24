import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'fast-deep-equal';
import {
  moveTop, moveRight,
  moveBottom, moveLeft,
  fightEnemies, pickWeapon,
  levelup
} from './../../actions'

const controls = {
  top: ['w','i','ArrowUp'],
  right: ['d', 'l', 'ArrowRight'],
  bottom: ['s', 'k', 'ArrowDown'],
  left: ['a', 'j', 'ArrowLeft']
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onKeyDown = this.props.onKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.experience.level > this.props.experience.level) {
      this.props.levelup(this.props.weapon.index);
    }
  }

  componentDidMount() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const size = 15;
    const boardWidth = size * this.props.width;
    const boardHeight = size * this.props.height;
    const herosWidth = 10;
    const herosHeight = 12;
    const paddindTop = size - herosHeight;

    if (this.props.game_over) {
      ctx.fillStyle = '#AFF';
      ctx.fillRect(150, 50, 100, 60);
      ctx.fillStyle = '#000';
      ctx.font = '14px sans-serif';
      ctx.fillText('Game Over', 162, 68, 160);
      ctx.font = '12px cursive';
      ctx.fillText('restartin in 5..', 162, 88, 160);
      return;
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, boardWidth, boardHeight);
    this.props.void.forEach(({ x, y }) => ctx.clearRect(x * size , y * size, size, size));

    const { hero, cave } = this.props;
    const weapon = this.props.weapon.point;
    const health = this.props.health.point;
    const enemies = this.props.enemies.map(e => e.point);

    ctx.fillStyle = '#00B';
    ctx.fillRect(hero.x * size,
      hero.y * size + paddindTop,
      herosWidth, herosHeight)
    ;
    
    ctx.fillStyle = '#777';
    ctx.fillRect(cave.x * size, cave.y * size, size, size);

    if (weapon) {
      ctx.fillStyle = '#990';
      ctx.fillRect(weapon.x * size, weapon.y * size, size * 0.7, size * 0.7);
    }
    if (health) {
      ctx.fillStyle = '#070';
      ctx.fillRect(health.x * size, health.y * size, size * 0.7, size * 0.7);
    }
    ctx.fillStyle = '#700';
    enemies.forEach(enemy => ctx.fillRect(
      enemy.x * size,
      enemy.y * size + paddindTop,
      herosWidth,
      herosHeight
    ));
  }

  componentDidUpdate() {
    this.componentDidMount.call(this);
  }

  render() {
    return (
      <canvas width={800} height={600} tabIndex={1}
        onKeyDown={this.onKeyDown}>
        hello world!
      </canvas>
    );
  }
}

function nextPoint(past, next) {
  const obj = next.x? { x: next.x } : { y: next.y };
  return Object.assign({}, past, obj);
}

export function collition(prevState, action) {
  const possibleState = nextPoint(prevState.hero, action);
  const collition = prevState
    .whiteSpaces
    .filter((val) => !prevState
      .enemies
      .find(v => deepEqual(val,v)));
  const vacuous = collition
    .find(pos => pos.x === possibleState.x && pos.y === possibleState.y);
  return vacuous;
}

Board = connect(function mapStateToProps(state) {
  return {
    void: state.whiteSpaces,
    hero: state.hero,
    cave: state.cave,
    weapon: state.weapon,
    health: state.health,
    enemies: state.enemies,
    dungeon: state.dungeon,
    attack: state.attack,
    experience: state.experience,
    game_over: state.game_over
  }
}, function mapDispatchToProps(dispatch) {
  return {
    levelup: (index) => dispatch(levelup(index)),
    onKeyDown(prox) {
      prox.preventDefault();
      const { hero, enemies, dungeon, health, attack, experience } = this.props;
      const { x, y } = hero;
      const vacuous = this.props.void;
      let func;
      if (controls.top.includes(prox.key)) {
        func = moveTop.bind(null, y);
      } else if (controls.right.includes(prox.key)) {
        func = moveRight.bind(null, x);
      } else if (controls.bottom.includes(prox.key)) {
        func = moveBottom.bind(null, y);
      } else if (controls.left.includes(prox.key)) {
        func = moveLeft.bind(null, x);
      } else return;
      const action = func();
      const doMove = collition({
        hero,
        whiteSpaces: vacuous,
        enemies: enemies.map(e => e.point)
      }, action);
      if (doMove) {
        requestAnimationFrame(() => dispatch(action));
      } else {
        const fight = enemies
          .find(e => deepEqual(e.point, nextPoint(e.point, action)))
        ;
        if (fight) {
          console.log('fight');
          requestAnimationFrame(function () {
            dispatch(fightEnemies(
              health,
              attack,
              enemies,
              nextPoint(hero, action),
              dungeon,
              experience));
          });
        }
      }
    }
  }
})(Board);
export default Board;
