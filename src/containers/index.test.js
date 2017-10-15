import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import App from './index';

test('React application', t => {
  t.plan(2);
  const wrapper = shallow(<App/>);
  t.true(wrapper.exists(), 'React application exists');
  t.equal(wrapper.find('p').text(), 'Hello World', 'Has a pragraph with text');
});
