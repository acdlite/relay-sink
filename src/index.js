import { Component } from 'react';
import Relay from 'react-relay';
import pick from 'lodash/object/pick';
import shallowEqual from './shallowEqual';

export function createSink(config, callback) {
  const fragmentKeys = Object.keys(config.fragments);

  class RelaySink extends Component {
    constructor(props) {
      super(props);
      this.fragments = pick(props, fragmentKeys);
      callback(this.fragments);
    }

    componentWillReceiveProps(nextProps) {
      const nextFragments = pick(nextProps, fragmentKeys);
      if (!shallowEqual(this.fragments, nextFragments)) {
        this.fragments = nextFragments;
        callback(this.fragments);
      }
    }

    render() {
      return null;
    }
  }

  return Relay.createContainer(RelaySink, config);
}
