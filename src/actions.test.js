import test from 'tape';
import weapons from './weapons';

import { levelup, LEVELUP } from './actions';

test('levelup', t => {
    t.plan(4);
    const index = 0;
    const level = 1;
    const action = levelup(index, level);
    const minAttack = 15;
    const maxAttack = 30;
    t.equal(action.type, LEVELUP, `type should be ${LEVELUP}`);
    t.equal(action.name, weapons[index + 1].name, 'name of weapon');
    t.true(
        action.attack >= minAttack && action.attack <= maxAttack,
        'should be in a range'
    );
    console.log('health', action.health);
    t.true(
        action.health >= 15 && action.health <= 20,
        'should be in a range'
    );
});


