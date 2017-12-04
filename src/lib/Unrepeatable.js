import deepEqual from 'fast-deep-equal';

export default function spitRandomUnrepeatable(collection, repeated) {
  let store = [];
  if (Array.isArray(repeated)) {
    store = store.concat(collection.reduce((c, e, i) => {
      repeated.forEach((r) => {
        if (deepEqual(e, r))
          c.push(i);
      });
      return c;
    }, []));
  }
  function random() {
    const index = Math.floor(Math.random() * collection.length);
    if (store.includes(index)) {
      console.log('one extra');
      return random();
    }
    else {
      store.push(index);
      return index;
    }
  }
  return {
    random
  };
}