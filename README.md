relay-sink
----------

[![build status](https://img.shields.io/travis/acdlite/relay-sink/master.svg?style=flat-square)](https://travis-ci.org/acdlite/relay-sink)
[![npm version](https://img.shields.io/npm/v/relay-sink.svg?style=flat-square)](https://www.npmjs.com/package/relay-sink)

## Usage

```js
import { createSink } from 'relay-sink';

const TyrionSink = createSink({
  // Normal Relay Container configuration
  fragments: {
    tyrion: () => Relay.QL`
      fragment on Character {
        name,
        house
      }
    `
  }
});

// A sink is a Relay Container. Compose with parent Relay containers like
// normal. Note that `this.props.tyrion` and `fragments.tyrion` below are not
// the same value — the former points to a value inside Relay's global store,
// while the latter is the actual unwrapped data.
<TyrionSink tyrion={this.props.tyrion} onFragmentUpdate={fragments => {
  expect(fragments.tyrion).to.eql({
    name: 'Tyrion',
    house: 'Lannister'
  });

  // Do whatever you want with the data — e.g. dispatch it to a Flux store
  store.dispatch({
    type: UPDATE_TYRION,
    payload: fragments.tyrion
  });
}}/>
```
