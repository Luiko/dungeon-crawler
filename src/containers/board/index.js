import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'fast-deep-equal';
import {
  moveTop, moveRight, moveBottom, moveLeft, levelup, restart, fightBoss, fightEnemy
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
      restarting: false
    };
    this.onKeyDown = this.props.onKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const level = nextProps.experience.level;
    const prevLevel = this.props.experience.level;
    if (level > prevLevel) {
      this.props.levelup(this.props.weapon.index, prevLevel);
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
      if (!this.state.restarting) {
        this.setState({ restarting: true });
        let counter = 0;
        const animation = setInterval(() => {
          if (counter++ < 5) {
            ctx.fillStyle = '#AFF';
            ctx.fillRect(150, 50, 100, 60);
            ctx.fillStyle = '#000';
            ctx.font = '14px sans-serif';
            ctx.fillText('Game Over', 162, 68, 160);
            ctx.font = '12px cursive';
            ctx.fillText(`restartin in ${5 - counter}..`, 162, 88, 160);
          } else {
            clearInterval(animation);
            this.props.restart();
            this.setState({ restarting: false });
          }
        }, 999);
      }
      return;
    } else if (this.props.won) {
      ctx.fillStyle = '#EEE';
      ctx.fillRect(150, 40, 110, 80);
      ctx.fillStyle = '#111';
      ctx.font = '16px sans-serif';
      ctx.fillText('You won!!!', 172, 76, 160);
      return;
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, boardWidth, boardHeight);
    this.props.void.forEach(({ x, y }) => ctx.clearRect(
      x * size,
      y * size,
      size,
      size
    ));

    const { hero, cave, boss } = this.props;
    const weapon = this.props.weapon.point;
    const health = this.props.health.point;
    const enemies = this.props.enemies.map(e => e.point);

    const drawGuy = (point) => ctx.fillRect(
      point.x * size,
      point.y * size + paddindTop,
      herosWidth,
      herosHeight
    );
    const drawBlock = (point) => ctx.fillRect(
      point.x * size,
      point.y * size,
      size,
      size
    );
    const drawItem = (point) => ctx.fillRect(
      point.x * size,
      point.y * size,
      size * 0.7,
      size * 0.7
    );

    ctx.fillStyle = '#00B';
    drawGuy(hero);
    ctx.fillStyle = '#777';
    drawBlock(cave);
    if (weapon) {
      ctx.fillStyle = '#990';
      drawItem(weapon);
    }
    if (health) {
      ctx.fillStyle = '#070';
      drawItem(health);
    }
    ctx.fillStyle = '#700';
    enemies.forEach(enemy => drawGuy(enemy));
    if (boss) {
      ctx.fillStyle = '#F0F';
      drawBlock(boss.point);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.dungeon !== this.props.dungeon) {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const size = 15;
      const boardWidth = size * this.props.width;
      const boardHeight = size * this.props.height;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, boardWidth, boardHeight);
    }
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
    game_over: state.game_over,
    boss: state.boss,
    won: state.won
  }
}, function mapDispatchToProps(dispatch) {
  return {
    levelup: (index, level) => dispatch(levelup(index, level)),
    restart: () => dispatch(restart()),
    onKeyDown(prox) {
      prox.preventDefault();
      const {
        hero, enemies, dungeon, health, attack, experience, boss, game_over,
        won
      } = this.props;
      const _break = game_over || won;
      const { x, y } = hero;
      const vacuous = this.props.void;
      let func;
      if (_break) return;
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
      const enemyList = enemies.map(e => e.point);
      const doMove = collition({
        hero,
        whiteSpaces: vacuous,
        enemies: !boss? enemyList: [...enemyList, boss.point]
      }, action);
      if (doMove) {
        requestAnimationFrame(() => dispatch(action));
      } else {
        const frontEnemy = enemies
          .find(e => deepEqual(e.point, nextPoint(hero, action)))
        ;
        const frontBoss = !boss? false: deepEqual(
          boss.point,
          nextPoint(hero, action))
        ;
        if (frontEnemy) {
          requestAnimationFrame(() => dispatch(fightEnemy(
            health.quantity,
            attack,
            frontEnemy,
            experience,
            dungeon
          )));
        } else if (frontBoss) {
          requestAnimationFrame(() => dispatch(fightBoss(
            health.quantity,
            attack,
            boss
          )));
        }
      }
    }
  }
})(Board);
export default Board;
