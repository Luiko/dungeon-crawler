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
    this.starterPoint = { x: 26, y: 10 };
    this.state = {
      restarting: false,
      darkness: true,
      randomSpawn: true
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

    const { hero, cave, boss } = this.props;
    const viewport = {
      x: hero.x - this.starterPoint.x,
      y: hero.y - this.starterPoint.y
    };

    const weapon = this.props.weapon.point;
    const health = this.props.health.point;
    const enemies = this.props.enemies.map(e => e.point);

    const drawGuy = (point) => ctx.fillRect(
      (point.x - viewport.x) * size,
      (point.y - viewport.y) * size + paddindTop,
      herosWidth,
      herosHeight
    );
    const drawBlock = (point) => ctx.fillRect(
      (point.x - viewport.x) * size,
      (point.y - viewport.y) * size,
      size,
      size
    );
    const drawItem = (point) => ctx.fillRect(
      (point.x - viewport.x) * size,
      (point.y - viewport.y) * size,
      size * 0.7,
      size * 0.7
    );

    const shadowRange = 6;
    const shadowing = s => {
      if (!this.state.darkness) return true;
      const x = Math.pow(s.x - hero.x, 2);
      const y = Math.pow(s.y - hero.y, 2);
      const isInShadowRange = Math.sqrt(x + y) <= shadowRange;
      return isInShadowRange;
    };
    const lighting = s => {
      const x = Math.pow(s.x - this.starterPoint.x, 2);
      const y = Math.pow(s.y - this.starterPoint.y, 2);
      const isInLightRange = Math.sqrt(x + y) <= shadowRange;
      return isInLightRange;
    };

    if (this.state.darkness) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 800, 400);
      for (
        let x = this.starterPoint.x - shadowRange;
        x <= this.starterPoint.x + shadowRange;
        x++
      ) {
        for (
          let y = this.starterPoint.y - shadowRange;
          y <= this.starterPoint.y + shadowRange;
          y++
        ) {
          if (lighting({ x, y })) {
            ctx.fillStyle = '#888';
          } else {
            ctx.fillStyle = '#000';
          }
          ctx.fillRect(
            x * size,
            y * size,
            size, size
          );
        }
      }
    } else {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, 800, 400);
    }

    this
      .props
      .void
      .filter(shadowing)
      .forEach(({ x, y }) => ctx.clearRect(
        (x - viewport.x) * size,
        (y - viewport.y) * size,
        size,
        size
    ));

    ctx.fillStyle = '#00B';
    ctx.fillRect(
      (this.starterPoint.x) * size,
      (this.starterPoint.y) * size + paddindTop,
      herosWidth,
      herosHeight
    );
    ctx.fillStyle = '#488';
    cave && shadowing(cave) && drawBlock(cave);
    if (weapon && shadowing(weapon)) {
      ctx.fillStyle = '#990';
      drawItem(weapon);
    }
    if (health && shadowing(health)) {
      ctx.fillStyle = '#070';
      drawItem(health);
    }
    ctx.fillStyle = '#700';
    enemies.filter(shadowing).forEach(enemy => drawGuy(enemy));
    if (boss && shadowing(boss.point)) {
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
      <div className='container'>
        <canvas width={800} height={400} tabIndex={1}
          onKeyDown={this.onKeyDown}>
          hello world!
        </canvas>
        <p>
          <label htmlFor='darknes'>darkness</label>
          <input type='checkbox' id='darknes' checked={this.state.darkness} onChange={
            () => this.setState((prevState => ({ darkness: !prevState.darkness })))
            }/>
          </p>
      </div>
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
