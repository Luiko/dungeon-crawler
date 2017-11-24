import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'fast-deep-equal';
import { passDungeon, pickWeapon, pickHealth } from './../actions';
import maps from './../lib/maps';
import Board from './board/index';

class App extends Component {
  componentDidUpdate() {
    const {
      hero, cave, dungeon, weapon, health,
      pickWeapon, pickHealth, passDungeon
    } = this.props;
    const dungeonPassed = deepEqual(hero, cave);
    const weaponPicked = deepEqual(hero, weapon.point);
    const healthPicked = deepEqual(hero, health.point);
    let action;
    if (dungeonPassed) {
      if (dungeon === 2) {

      }
      else
        action = passDungeon.bind(null,dungeon);
    } else if (weaponPicked) {
      action = pickWeapon.bind(null,weapon);
    } else if (healthPicked) {
      action = pickHealth.bind(null,this.props.experience.level);
    }
    if (action)
      requestAnimationFrame(action);
  }

  render() {
    const d = this.props.dungeon - 1;
    return (
      <div className="container">
        <div>
          <p>
            <span>Health: </span>{this.props.health.quantity}
            <span> Level: </span>{this.props.experience.level}
            <span> Experience: </span>
              {this.props.experience.current}/{this.props.experience.levelup}XP
            <span> Attack: </span>{this.props.attack}
            <span> Weapon: </span>{this.props.weapon.name}
            <span> Dungeon: </span>{this.props.dungeon}
          </p>
        </div>
        <Board
          width={maps[d].getWidth()}
          height={maps[d].getHeight()}
        />
      </div>
    );
  }
}

App = connect(function mapStateToProps(state) {
  return {
    hero: state.hero,
    dungeon: state.dungeon,
    cave: state.cave,
    weapon: state.weapon,
    attack: state.attack,
    health: state.health,
    experience: state.experience
  }
}, { pickWeapon, pickHealth, passDungeon })(App);
export default App;
