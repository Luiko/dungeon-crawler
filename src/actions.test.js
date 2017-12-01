import test from 'tape';
// import weapons from './weapons';

import { levelup, LEVELUP, fightEnemy, FIGHT_ENEMY, enemyDamage } from './actions';

test('levelup', t => {
  t.plan(4);
  const index = 0;
  const level = 1;
  const action = levelup(index, level);
  t.equal(action.type, LEVELUP, `type should be ${LEVELUP}`);

  const minAttack = 15;
  const maxAttack = 20;
  t.equal(action.name, 'broken glass bottle', 'name of weapon');
  t.true(
    action.attack >= minAttack && action.attack <= maxAttack,
    'attack should be in a range'
  );

  const minHealth = 24;
  const maxHealth = 44;
  t.true(
    action.health >= minHealth && action.health <= maxHealth,
    'health should be in a range'
  );
});

test('fight enemy', t => {
  const health = 50;
  const attack = 60;
  const enemy = {
    id: 'coco#8',
    health: 70
  };
  const experience = 200;
  const nextlvl = 400;
  const level = 2;
  const dungeon = 2;

  t.plan(5);
  const action = fightEnemy(
    health,
    attack,
    enemy,
    { total: experience, levelup: nextlvl, level },
    dungeon
);
  const minEnemyDamage = 12;
  const maxEnemyDamage = 16;
  const minHealth = health - maxEnemyDamage;
  const maxHealth = health - minEnemyDamage;
  t.true(
    action.payload.health >= minHealth
      && action.payload.health <= maxHealth,
    'health should be in a range'
  );
  t.equal(
    action.payload.enemy.health,
    enemy.health - attack,
    'enemy should be wounded'
  );
  t.equal(
    action.payload.experience.total,
    experience,
    'experience should be uniform'
  );
  t.equal(
    action.payload.experience.levelup,
    nextlvl,
    'levelup should be uniform'
  );
  t.equal(
    action.payload.experience.level,
    level,
    'level should be uniform'
  );
});
